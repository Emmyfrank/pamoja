export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateContent = (content: string): ValidationResult => {
  // Check for empty or whitespace-only content
  if (!content.trim()) {
    return {
      isValid: false,
      message: "Message cannot be empty",
    };
  }

  // Check for message length
  if (content.length > 1000) {
    return {
      isValid: false,
      message: "Message is too long (maximum 1000 characters)",
    };
  }

  // Check for spam-like behavior (repeated characters)
  const repeatedCharsRegex = /(.)\1{9,}/;
  if (repeatedCharsRegex.test(content)) {
    return {
      isValid: false,
      message: "Message contains too many repeated characters",
    };
  }

  // Check for excessive uppercase (shouting)
  const uppercaseRatio =
    (content.match(/[A-Z]/g)?.length || 0) / content.length;
  if (content.length > 10 && uppercaseRatio > 0.7) {
    return {
      isValid: false,
      message: "Please don't use too many capital letters",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
