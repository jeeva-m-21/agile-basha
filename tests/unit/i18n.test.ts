import { describe, it, expect } from "vitest";
import en from "@/i18n/en.json";
import ta from "@/i18n/ta.json";

describe("i18n translation dictionaries", () => {
  it("contains all common keys in English and Tamil", () => {
    expect(en.common.appName).toBe("Bhāṣā");
    expect(ta.common.appName).toBe("பாஷா");
    expect(en.common.continue).toBe("Continue");
    expect(ta.common.continue).toBe("தொடர்க");
  });

  it("contains all 6 onboarding steps in both languages", () => {
    expect(en.onboarding.step1.title).toBeTruthy();
    expect(ta.onboarding.step1.title).toBeTruthy();

    expect(en.onboarding.step2.title).toBeTruthy();
    expect(ta.onboarding.step2.title).toBeTruthy();

    expect(en.onboarding.step3.title).toBeTruthy();
    expect(ta.onboarding.step3.title).toBeTruthy();

    expect(en.onboarding.step4.title).toBeTruthy();
    expect(ta.onboarding.step4.title).toBeTruthy();

    expect(en.onboarding.step5.title).toBeTruthy();
    expect(ta.onboarding.step5.title).toBeTruthy();

    expect(en.onboarding.step6.title).toBeTruthy();
    expect(ta.onboarding.step6.title).toBeTruthy();
  });

  it("correctly specifies scripts in Tamil as native bridge", () => {
    expect(ta.onboarding.step2.tamil).toContain("தமிழ் வடிவம்");
    expect(ta.onboarding.step2.devanagari).toContain("தேவநாகரி");
  });
});
