import { describe, it, expect, beforeEach } from "vitest";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { POST, GET } from "@/app/api/onboarding/preferences/route";

describe("Preferences Store", () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferencesStore.setState({
      learnIn: "en",
      script: "devanagari",
      helperLine: "roman",
      goals: ["gita"],
      level: "beginner",
      dailyGoalMin: 10,
    });
  });

  it("updates learning language and syncs to localStorage", () => {
    usePreferencesStore.getState().setLearnIn("ta");
    expect(usePreferencesStore.getState().learnIn).toBe("ta");
    expect(localStorage.getItem("learn_in")).toBe("ta");
  });

  it("updates Sanskrit script selection", () => {
    usePreferencesStore.getState().setScript("tamil");
    expect(usePreferencesStore.getState().script).toBe("tamil");
    expect(localStorage.getItem("sanskrit_script")).toBe("tamil");
  });

  it("toggles multiple goals properly", () => {
    usePreferencesStore.getState().setGoals(["gita"]);
    usePreferencesStore.getState().toggleGoal("mantras");
    expect(usePreferencesStore.getState().goals).toEqual(["gita", "mantras"]);

    usePreferencesStore.getState().toggleGoal("gita");
    expect(usePreferencesStore.getState().goals).toEqual(["mantras"]);
  });

  it("updates daily goal commitment", () => {
    usePreferencesStore.getState().setDailyGoalMin(20);
    expect(usePreferencesStore.getState().dailyGoalMin).toBe(20);
    expect(localStorage.getItem("daily_goal_min")).toBe("20");
  });
});

describe("Preferences API Route", () => {
  it("saves preferences and returns success", async () => {
    const request = new Request("http://localhost:3000/api/onboarding/preferences", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user-1",
        learnIn: "ta",
        script: "tamil",
        helperLine: "off",
        goals: ["gita", "mantras"],
        dailyGoalMin: 15,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.preferences.learnIn).toBe("ta");
    expect(data.preferences.script).toBe("tamil");
  });

  it("rejects invalid script selection with 400", async () => {
    const request = new Request("http://localhost:3000/api/onboarding/preferences", {
      method: "POST",
      body: JSON.stringify({
        learnIn: "en",
        script: "invalid-script",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("retrieves saved preferences via GET", async () => {
    const request = new Request("http://localhost:3000/api/onboarding/preferences?userId=test-user-1");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.preferences.userId).toBe("test-user-1");
    expect(data.preferences.learnIn).toBe("ta");
  });
});
