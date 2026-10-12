/**
 * Comprehensive 26-question curriculum dataset covering:
 * Arrays, Strings, HashMap/HashSet, Searching, Sorting, Two Pointers, Sliding Window
 */
export const INITIAL_QUESTIONS = [
  // Arrays
  {
    id: "q-arr-1",
    title: "Contains Duplicate",
    topic: "Arrays",
    difficulty: "Easy",
    timeEstimate: 15,
    summary: "Determine if any value appears at least twice in an integer array.",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ],
    hints: [
      "Consider using a HashSet to store seen elements in O(N) time.",
      "Alternatively, sorting takes O(N log N) time and O(1) extra space."
    ]
  },
  {
    id: "q-arr-2",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    difficulty: "Easy",
    timeEstimate: 20,
    summary: "Maximize your profit by choosing a single day to buy and a different day to sell.",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
      { input: "prices = [7,6,4,3,1]", output: "0" }
    ],
    hints: [
      "Track the minimum price seen so far as you iterate through the list.",
      "Calculate the current profit at each day and update your max profit."
    ]
  },
  {
    id: "q-arr-3",
    title: "Product of Array Except Self",
    topic: "Arrays",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Return an array where each element is the product of all other elements without using division.",
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in O(n) time and without using the division operation.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
    ],
    hints: [
      "Think about prefix products and suffix products.",
      "First compute prefix products from left to right, then suffix products backwards."
    ]
  },
  {
    id: "q-arr-4",
    title: "Maximum Subarray (Kadane's)",
    topic: "Arrays",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Find the subarray with the largest sum and return its sum.",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [5,4,-1,7,8]", output: "23" }
    ],
    hints: [
      "At each index, decide whether to append nums[i] to the current subarray or start a fresh subarray at nums[i].",
      "Keep track of the global maximum subarray sum."
    ]
  },

  // Strings
  {
    id: "q-str-1",
    title: "Valid Anagram",
    topic: "Strings",
    difficulty: "Easy",
    timeEstimate: 15,
    summary: "Determine if string t is an anagram of string s.",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An Anagram is a word formed by rearranging the letters of a different word.",
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
      { input: "s = \"rat\", t = \"car\"", output: "false" }
    ],
    hints: [
      "Check length first. If lengths differ, return false immediately.",
      "Use a fixed frequency array of size 26 or a hash map for character counts."
    ]
  },
  {
    id: "q-str-2",
    title: "Valid Parentheses",
    topic: "Strings",
    difficulty: "Easy",
    timeEstimate: 20,
    summary: "Determine if the input string has valid matching bracket pairs.",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" }
    ],
    hints: [
      "Use a Stack data structure to push open brackets.",
      "When encountering a closing bracket, verify that the top element of the stack matches."
    ]
  },
  {
    id: "q-str-3",
    title: "Group Anagrams",
    topic: "Strings",
    difficulty: "Medium",
    timeEstimate: 30,
    summary: "Group strings that are anagrams of each other.",
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
    ],
    hints: [
      "Two strings are anagrams if their sorted representations or character count tuples are identical.",
      "Use this normalized key in a hash map mapping to arrays of strings."
    ]
  },
  {
    id: "q-str-4",
    title: "Longest Palindromic Substring",
    topic: "Strings",
    difficulty: "Medium",
    timeEstimate: 30,
    summary: "Find the longest palindromic substring in string s.",
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    examples: [
      { input: "s = \"babad\"", output: "\"bab\" (or \"aba\")" },
      { input: "s = \"cbbd\"", output: "\"bb\"" }
    ],
    hints: [
      "Every palindrome expands around its center.",
      "Consider both odd length centers (single character) and even length centers (pair of characters)."
    ]
  },

  // HashMap/HashSet
  {
    id: "q-map-1",
    title: "Two Sum",
    topic: "HashMap/HashSet",
    difficulty: "Easy",
    timeEstimate: 15,
    summary: "Find indices of two numbers that add up to target.",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    hints: [
      "Store complement `target - nums[i]` in a map with its index as value.",
      "You can do this in a single pass O(N) runtime."
    ]
  },
  {
    id: "q-map-2",
    title: "Ransom Note",
    topic: "HashMap/HashSet",
    difficulty: "Easy",
    timeEstimate: 15,
    summary: "Determine if ransomNote can be constructed from magazine letters.",
    description: "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine` and `false` otherwise.",
    examples: [
      { input: "ransomNote = \"a\", magazine = \"b\"", output: "false" },
      { input: "ransomNote = \"aa\", magazine = \"aab\"", output: "true" }
    ],
    hints: [
      "Count character frequencies in magazine.",
      "Decrement frequencies while checking ransomNote."
    ]
  },
  {
    id: "q-map-3",
    title: "Longest Consecutive Sequence",
    topic: "HashMap/HashSet",
    difficulty: "Medium",
    timeEstimate: 30,
    summary: "Find the length of the longest consecutive elements sequence in O(n) time.",
    description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4 (sequence: [1, 2, 3, 4])" }
    ],
    hints: [
      "Put all numbers into a HashSet.",
      "Only start counting a sequence when `num - 1` is not in the set (i.e. num is the start of a sequence)."
    ]
  },
  {
    id: "q-map-4",
    title: "Subarray Sum Equals K",
    topic: "HashMap/HashSet",
    difficulty: "Medium",
    timeEstimate: 30,
    summary: "Find the total number of continuous subarrays whose sum equals k.",
    description: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    examples: [
      { input: "nums = [1,1,1], k = 2", output: "2" },
      { input: "nums = [1,2,3], k = 3", output: "2" }
    ],
    hints: [
      "Maintain a running prefix sum.",
      "Check if `prefixSum - k` exists in your hash map of frequency counts."
    ]
  },

  // Searching
  {
    id: "q-srch-1",
    title: "Binary Search",
    topic: "Searching",
    difficulty: "Easy",
    timeEstimate: 15,
    summary: "Search for target in sorted array in O(log n) time.",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
    ],
    hints: [
      "Use two pointers `left = 0`, `right = nums.length - 1`.",
      "Calculate `mid = left + Math.floor((right - left) / 2)` to avoid integer overflow."
    ]
  },
  {
    id: "q-srch-2",
    title: "Search a 2D Matrix",
    topic: "Searching",
    difficulty: "Medium",
    timeEstimate: 20,
    summary: "Search for a value in an m x n sorted matrix in O(log(m*n)) time.",
    description: "You are given an `m x n` integer matrix with properties where each row is sorted and the first integer of each row is greater than the last integer of the previous row. Return `true` if target is in matrix.",
    examples: [
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" }
    ],
    hints: [
      "Treat the 2D matrix as a virtual 1D sorted array of length `m * n`.",
      "Convert 1D index `idx` to 2D indices: `row = Math.floor(idx / n)`, `col = idx % n`."
    ]
  },
  {
    id: "q-srch-3",
    title: "Find Minimum in Rotated Sorted Array",
    topic: "Searching",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Find the minimum element in an array rotated between 1 and n times.",
    description: "Suppose an array of length `n` sorted in ascending order is rotated between 1 and n times. Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in [a[n-1], a[0], a[1], ..., a[n-2]]. Find the minimum element in O(log n) time.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" }
    ],
    hints: [
      "Compare `nums[mid]` with `nums[right]`.",
      "If `nums[mid] > nums[right]`, the minimum must lie in the right half `(mid + 1 to right)`."
    ]
  },
  {
    id: "q-srch-4",
    title: "Search in Rotated Sorted Array",
    topic: "Searching",
    difficulty: "Medium",
    timeEstimate: 30,
    summary: "Find the index of target in rotated sorted array in O(log n) time.",
    description: "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
    ],
    hints: [
      "At least one half (left or right) is guaranteed to be strictly sorted at any midpoint.",
      "Check if target falls within the sorted half; if not, search the other half."
    ]
  },

  // Sorting
  {
    id: "q-sort-1",
    title: "Sort Colors (Dutch National Flag)",
    topic: "Sorting",
    difficulty: "Medium",
    timeEstimate: 20,
    summary: "Sort an array with 0s, 1s, and 2s in-place in one pass.",
    description: "Given an array `nums` with `n` objects colored red, white, or blue (represented by 0, 1, and 2), sort them in-place so that objects of the same color are adjacent.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" }
    ],
    hints: [
      "Maintain three pointers: low, mid, and high.",
      "Swap 0s to the left and 2s to the right while advancing mid."
    ]
  },
  {
    id: "q-sort-2",
    title: "Merge Intervals",
    topic: "Sorting",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Merge all overlapping intervals into non-overlapping intervals.",
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }
    ],
    hints: [
      "Sort intervals by their starting value.",
      "Iterate through sorted intervals: if current interval overlaps with previous merged interval, extend its end."
    ]
  },
  {
    id: "q-sort-3",
    title: "Top K Frequent Elements",
    topic: "Sorting",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Return the k most frequent elements in an integer array.",
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" }
    ],
    hints: [
      "Use a hash map to count frequencies.",
      "Bucket sort by frequency achieves linear O(N) time complexity."
    ]
  },
  {
    id: "q-sort-4",
    title: "Kth Largest Element in an Array",
    topic: "Sorting",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Find the kth largest element without full sorting.",
    description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in sorted order, not the `k`th distinct element.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }
    ],
    hints: [
      "Consider using a min-heap of size k or QuickSelect algorithm for average O(N) time."
    ]
  },

  // Two Pointers
  {
    id: "q-tp-1",
    title: "Valid Palindrome",
    topic: "Two Pointers",
    difficulty: "Easy",
    timeEstimate: 15,
    summary: "Check if alphanumeric characters read the same backward as forward.",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome.",
    examples: [
      { input: "s = \"A man, a plan, a canal: Panama\"", output: "true" },
      { input: "s = \"race a car\"", output: "false" }
    ],
    hints: [
      "Use two pointers at opposite ends moving inward.",
      "Skip non-alphanumeric characters."
    ]
  },
  {
    id: "q-tp-2",
    title: "Two Sum II - Input Array Is Sorted",
    topic: "Two Pointers",
    difficulty: "Medium",
    timeEstimate: 20,
    summary: "Find two numbers in 1-indexed sorted array that add up to target.",
    description: "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number using O(1) extra space.",
    examples: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" }
    ],
    hints: [
      "Place left pointer at start and right pointer at end.",
      "If sum < target, advance left; if sum > target, decrement right."
    ]
  },
  {
    id: "q-tp-3",
    title: "3Sum",
    topic: "Two Pointers",
    difficulty: "Medium",
    timeEstimate: 35,
    summary: "Find all unique triplets [nums[i], nums[j], nums[k]] that sum to 0.",
    description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. Notice that the solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
    ],
    hints: [
      "Sort the array first.",
      "Iterate through the array fixing the first element, then use two pointers for the remaining pair while skipping duplicates."
    ]
  },
  {
    id: "q-tp-4",
    title: "Container With Most Water",
    topic: "Two Pointers",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Find two lines that together with the x-axis form a container containing the most water.",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" }
    ],
    hints: [
      "Start with widest possible container (left = 0, right = n-1).",
      "Area is constrained by the shorter line, so always advance the pointer at the shorter height."
    ]
  },

  // Sliding Window
  {
    id: "q-sw-1",
    title: "Maximum Average Subarray I",
    topic: "Sliding Window",
    difficulty: "Easy",
    timeEstimate: 15,
    summary: "Find a contiguous subarray of length k whose average value is maximum.",
    description: "You are given an integer array `nums` consisting of `n` elements, and an integer `k`. Find a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value.",
    examples: [
      { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75" }
    ],
    hints: [
      "Compute initial sum of first k elements.",
      "Slide the window by adding incoming element and subtracting outgoing element."
    ]
  },
  {
    id: "q-sw-2",
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    difficulty: "Medium",
    timeEstimate: 25,
    summary: "Find the length of the longest substring without duplicate characters.",
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    examples: [
      { input: "s = \"abcabcbb\"", output: "3 (\"abc\")" },
      { input: "s = \"bbbbb\"", output: "1 (\"b\")" },
      { input: "s = \"pwwkew\"", output: "3 (\"wke\")" }
    ],
    hints: [
      "Use a sliding window with a HashMap/Set of character last-seen indices.",
      "When a duplicate is encountered within current window, advance window left pointer."
    ]
  },
  {
    id: "q-sw-3",
    title: "Minimum Window Substring",
    topic: "Sliding Window",
    difficulty: "Hard",
    timeEstimate: 40,
    summary: "Find minimum substring of s that contains every character in t.",
    description: "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
    examples: [
      { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"" },
      { input: "s = \"a\", t = \"aa\"", output: "\"\"" }
    ],
    hints: [
      "Use two frequency maps: target character requirements and current window counts.",
      "Expand right pointer until valid window is formed, then shrink left pointer to find minimum length."
    ]
  }
];

export const TOPICS = [
  "Arrays",
  "Strings",
  "HashMap/HashSet",
  "Searching",
  "Sorting",
  "Two Pointers",
  "Sliding Window"
];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const MISTAKE_CATEGORIES = [
  "Logic",
  "Edge case",
  "Syntax",
  "Complexity",
  "Time pressure",
  "Other"
];

export const DEFAULT_USER_PREFERENCES = {
  displayName: "Alex Rivera",
  targetRole: "Software Engineer (SDE I)",
  currentLevel: "Beginner", // "Beginner" | "Intermediate" | "Advanced"
  dailyHours: 2,
  targetWeeks: 6,
  knownTopics: ["Arrays", "Strings"],
  notificationsEnabled: true
};

/**
 * Seed initial attempt logs representing realistic recent activity
 */
export const INITIAL_ATTEMPTS = [
  {
    id: "att-1",
    questionId: "q-arr-1",
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    result: "Solved", // "Solved" | "Failed"
    timeTaken: 12,
    mistakeCategory: null,
    notes: "Solved smoothly using HashSet. Handled empty and single element edge cases.",
    needsRevision: false
  },
  {
    id: "att-2",
    questionId: "q-str-1",
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    result: "Solved",
    timeTaken: 14,
    mistakeCategory: null,
    notes: "Used 26-char frequency counter array. Optimal O(N) runtime.",
    needsRevision: false
  },
  {
    id: "att-3",
    questionId: "q-map-1",
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    result: "Solved",
    timeTaken: 18,
    mistakeCategory: null,
    notes: "Single pass hash map lookup for target complement.",
    needsRevision: false
  },
  {
    id: "att-4",
    questionId: "q-arr-3",
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    result: "Failed",
    timeTaken: 28,
    mistakeCategory: "Complexity",
    notes: "Initially implemented nested loops O(N^2). Need to practice prefix & suffix running products.",
    needsRevision: true
  },
  {
    id: "att-5",
    questionId: "q-str-2",
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    result: "Failed",
    timeTaken: 22,
    mistakeCategory: "Edge case",
    notes: "Forgot to check if stack was empty at the end for strings like '(' with unclosed opening bracket.",
    needsRevision: true
  },
  {
    id: "att-6",
    questionId: "q-tp-1",
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    result: "Solved",
    timeTaken: 11,
    mistakeCategory: null,
    notes: "Two pointers inward scan. Handled regex alphanumeric filtering cleanly.",
    needsRevision: false
  }
];
