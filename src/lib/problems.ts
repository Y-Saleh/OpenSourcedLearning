import type { Problem } from '@/types';

export const problems: Problem[] = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to 'target'. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    difficulty: 'Easy',
    category: 'Arrays',
    initialCode: `function solution(nums, target) {
  // Your code here
}`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1] },
      { input: [[3, 2, 4], 6], output: [1, 2] },
      { input: [[3, 3], 6], output: [0, 1] },
    ],
  },
  {
    slug: 'reverse-string',
    title: 'Reverse String',
    description: `Write a function that reverses a string. The input string is given as an array of characters 's'. You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: 'Easy',
    category: 'Strings',
    initialCode: `function solution(s) {
  // Your code here. The function should modify 's' in-place.
  return s;
}`,
    testCases: [
      { input: [['h', 'e', 'l', 'l', 'o']], output: ['o', 'l', 'l', 'e', 'h'] },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], output: ['h', 'a', 'n', 'n', 'a', 'H'] },
    ],
  },
  {
    slug: 'fibonacci-number',
    title: 'Fibonacci Number',
    description: `The Fibonacci numbers, commonly denoted F(n), form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2) for n > 1. Given 'n', calculate F(n).`,
    difficulty: 'Easy',
    category: 'Recursion',
    initialCode: `function solution(n) {
  // Your code here
}`,
    testCases: [
      { input: [2], output: 1 },
      { input: [3], output: 2 },
      { input: [4], output: 3 },
      { input: [10], output: 55 },
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: `Given a string 's' containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'Medium',
    category: 'Stacks',
    initialCode: `function solution(s) {
  // Your code here
}`,
    testCases: [
      { input: ['()'], output: true },
      { input: ['()[]{}'], output: true },
      { input: ['(]'], output: false },
      { input: ['{[]}'], output: true },
    ],
  },
];

export const problemCategories = [...new Set(problems.map(p => p.category))];
