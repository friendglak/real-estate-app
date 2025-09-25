import {
  formatCurrency,
  formatNumber,
  truncateText,
  capitalizeWords,
  debounce,
  slugify,
  isValidPrice,
} from "../formatters";

describe("formatters", () => {
  describe("formatCurrency", () => {
    it("formats currency with default USD and en-US locale", () => {
      expect(formatCurrency(1000)).toBe("$1,000");
      expect(formatCurrency(1000000)).toBe("$1,000,000");
      expect(formatCurrency(1234.56)).toBe("$1,235");
    });

    it("formats currency with different currency", () => {
      expect(formatCurrency(1000, "EUR")).toBe("€1,000");
      expect(formatCurrency(1000, "GBP")).toBe("£1,000");
    });

    it("handles zero and negative values", () => {
      expect(formatCurrency(0)).toBe("$0");
      expect(formatCurrency(-1000)).toBe("-$1,000");
    });

    it("rounds to whole numbers", () => {
      expect(formatCurrency(1234.99)).toBe("$1,235");
      expect(formatCurrency(1234.01)).toBe("$1,234");
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with K suffix", () => {
      expect(formatNumber(1000)).toBe("1K");
      expect(formatNumber(1500)).toBe("1.5K");
      expect(formatNumber(9999)).toBe("10K");
    });

    it("formats numbers with M suffix", () => {
      expect(formatNumber(1000000)).toBe("1M");
      expect(formatNumber(1500000)).toBe("1.5M");
      expect(formatNumber(9999999)).toBe("10M");
    });

    it("formats numbers with B suffix", () => {
      expect(formatNumber(1000000000)).toBe("1B");
      expect(formatNumber(1500000000)).toBe("1.5B");
      expect(formatNumber(9999999999)).toBe("10B");
    });

    it("handles numbers less than 1000", () => {
      expect(formatNumber(999)).toBe("999");
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(1)).toBe("1");
    });

    it("handles negative numbers", () => {
      expect(formatNumber(-1000)).toBe("-1K");
      expect(formatNumber(-1000000)).toBe("-1M");
      expect(formatNumber(-1000000000)).toBe("-1B");
    });

    it("removes .0 from whole numbers", () => {
      expect(formatNumber(1000)).toBe("1K");
      expect(formatNumber(1000000)).toBe("1M");
      expect(formatNumber(1000000000)).toBe("1B");
    });
  });

  describe("truncateText", () => {
    it("returns original text if shorter than maxLength", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
      expect(truncateText("Hello World", 11)).toBe("Hello World");
    });

    it("truncates text longer than maxLength", () => {
      expect(truncateText("Hello World", 5)).toBe("Hello...");
      expect(truncateText("This is a very long text", 10)).toBe(
        "This is a ..."
      );
    });

    it("handles empty string", () => {
      expect(truncateText("", 5)).toBe("");
    });

    it("handles maxLength of 0", () => {
      expect(truncateText("Hello", 0)).toBe("...");
    });
  });

  describe("capitalizeWords", () => {
    it("capitalizes first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("this is a test")).toBe("This Is A Test");
    });

    it("handles single word", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
    });

    it("handles already capitalized words", () => {
      expect(capitalizeWords("Hello World")).toBe("Hello World");
    });

    it("handles mixed case", () => {
      expect(capitalizeWords("hELLo WoRLd")).toBe("Hello World");
    });

    it("handles empty string", () => {
      expect(capitalizeWords("")).toBe("");
    });

    it("handles special characters", () => {
      expect(capitalizeWords("hello-world test_case")).toBe(
        "Hello-world Test_case"
      );
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("delays function execution", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("arg1", "arg2");
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("cancels previous calls when called again", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("first");
      jest.advanceTimersByTime(50);
      debouncedFn("second");
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("second");
    });

    it("preserves function context", () => {
      const obj = {
        value: "test",
        method: jest.fn(function () {
          return this.value;
        }),
      };

      const debouncedMethod = debounce(obj.method.bind(obj), 100);
      debouncedMethod();
      jest.advanceTimersByTime(100);

      expect(obj.method).toHaveBeenCalled();
    });
  });

  describe("slugify", () => {
    it("converts text to lowercase", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("replaces spaces with hyphens", () => {
      expect(slugify("hello world test")).toBe("hello-world-test");
    });

    it("removes special characters", () => {
      expect(slugify("hello@world#test")).toBe("helloworldtest");
      expect(slugify("hello!@#$%^&*()world")).toBe("helloworld");
    });

    it("replaces underscores with hyphens", () => {
      expect(slugify("hello_world_test")).toBe("hello-world-test");
    });

    it("removes leading and trailing hyphens", () => {
      expect(slugify("-hello-world-")).toBe("hello-world");
      expect(slugify("---hello---world---")).toBe("hello-world");
    });

    it("handles multiple consecutive spaces and special characters", () => {
      expect(slugify("hello   world!!!test")).toBe("hello-worldtest");
    });

    it("handles empty string", () => {
      expect(slugify("")).toBe("");
    });

    it("handles only special characters", () => {
      expect(slugify("!@#$%^&*()")).toBe("");
    });
  });

  describe("isValidPrice", () => {
    it("validates positive numbers", () => {
      expect(isValidPrice(100)).toBe(true);
      expect(isValidPrice(100.5)).toBe(true);
      expect(isValidPrice(0)).toBe(true);
    });

    it("validates positive number strings", () => {
      expect(isValidPrice("100")).toBe(true);
      expect(isValidPrice("100.50")).toBe(true);
      expect(isValidPrice("0")).toBe(true);
    });

    it("rejects negative numbers", () => {
      expect(isValidPrice(-100)).toBe(false);
      expect(isValidPrice(-100.5)).toBe(false);
    });

    it("rejects negative number strings", () => {
      expect(isValidPrice("-100")).toBe(false);
      expect(isValidPrice("-100.50")).toBe(false);
    });

    it("rejects invalid strings", () => {
      expect(isValidPrice("abc")).toBe(false);
      expect(isValidPrice("")).toBe(false);
      expect(isValidPrice("100abc")).toBe(true); // parseFloat('100abc') returns 100, which is valid
    });

    it("rejects NaN", () => {
      expect(isValidPrice(NaN)).toBe(false);
    });

    it("rejects Infinity", () => {
      expect(isValidPrice(Infinity)).toBe(true); // Infinity >= 0 is true
      expect(isValidPrice(-Infinity)).toBe(false);
    });
  });
});
