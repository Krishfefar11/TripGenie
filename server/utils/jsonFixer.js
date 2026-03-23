/**
 * JSON Fixer Utility
 * 
 * Attempts to repair common JSON syntax errors produced by LLMs,
 * such as missing commas between fields or trailing commas.
 */

function repairJson(jsonString) {
  if (!jsonString) return jsonString;

  let fixed = jsonString.trim();

  // 1. Fix missing commas between fields: "field": "value" "nextField":
  // This looks for a double quote followed by whitespace and another double quote
  // where the first double quote is NOT preceded by a colon or comma.
  // Actually, a simpler way is to look for "}\s*{" and replace with "}, {"
  // and '"\s*"' and replace with '", "' if it's between keys/values.
  
  // Rule: Close quote followed by whitespace and open quote for a new key
  // Example: "value" "key": -> "value", "key":
  fixed = fixed.replace(/"\s+"/g, '", "');
  
  // Rule: Close brace followed by whitespace and open quote for a new key (inside object)
  // Example: } "key": -> }, "key":
  fixed = fixed.replace(/\}\s+"/g, '}, "');

  // Rule: Close quote followed by whitespace and open brace (start of new object in array)
  // Example: "value" { -> "value", {
  fixed = fixed.replace(/"\s+\{/g, '", {');

  // Rule: Close brace followed by open brace (missing comma in array)
  // Example: } { -> }, {
  fixed = fixed.replace(/\}\s+\{/g, '}, {');

  // Rule: Double quote followed by colon (missing comma before a new key-value pair)
  // This is tricky but common if the previous value was a number or boolean
  // Example: 60 "afternoon": -> 60, "afternoon":
  fixed = fixed.replace(/(\d+|true|false|null)\s+"/g, '$1, "');

  return fixed;
}

module.exports = { repairJson };
