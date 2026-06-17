const MOCK_DATABASE = [
  "apple", "apricot", "avocado", "banana", "blueberry", "blackberry",
  "cherry", "coconut", "cranberry", "date", "dragonfruit", "durian",
  "elderberry", "fig", "grape", "grapefruit", "guava", "kiwi",
  "lemon", "lime", "mango", "melon", "orange", "papaya", "peach",
  "pear", "pineapple", "plum", "pomegranate", "raspberry", "strawberry"
];

export const mockSearchApi = (searchString, signal) => {
  return new Promise((resolve, reject) => {
    // Simulate unpredictable network latency (between 200ms and 1000ms)
    const randomLatency = Math.floor(Math.random() * 800) + 200;

    const timeoutId = setTimeout(() => {
      if (signal?.aborted) {
        return reject(new DOMException("Aborted", "AbortError"));
      }

      if (!searchString.trim()) {
        return resolve([]);
      }

      // Filter local database items matching the query
      const filteredResults = MOCK_DATABASE.filter(item =>
        item.toLowerCase().startsWith(searchString.toLowerCase())
      );

      resolve(filteredResults);
    }, randomLatency);

    // If the signal aborts mid-way, clear the timeout instantly
    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
};