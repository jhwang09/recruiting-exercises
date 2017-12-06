## Overview
I decided to work on this problem with Typescript + Node.JS as a way to learn new technologies. Working with Typescript has been interesting and it does show me a different way of working with JavaScript.

## Prerequisites
1. Install node

## Steps to Run
1. Checkout the code
```
git clone https://github.com/jhwang09/recruiting-exercises
```
2. Change directory to 
```
cd ./recruiting-exercises/inventory-allocator
```
3. Install all dependencies
```
npm install
```
4. Run the code
```
npm run dev
```

### Run tests
```
npm run test
```

## Useful Resources
1. https://basarat.gitbooks.io/typescript/docs/quick/nodejs.html
2. https://www.typescriptlang.org/docs/home.html
3. https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md
4. https://facebook.github.io/immutable-js/
5. https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2
6. http://usejsdoc.org/tags-param.html
7. https://mochajs.org/
8. http://chaijs.com/

## Origainl Problem Statement

### Problem

Inventory allocator is a class that computes all possible shipments given a particular inventory distribution. The way we would use the output is take each shipment configuration and estimate how much it costs and pick the optimal one.

Your task is to implement InventoryAllocator class to produce all possible shipment configurations. The class should have one function that takes in some input. The first input will be a map of items that are being ordered and how many of them are ordered. The second input will be a map of warehouses to inventory amounts for these items. 

You can use any language of your choice to write the solution (internally we use Typescript/Javascript and some Java). Please write unit tests with your code, a few are mentioned below, but these are not comprehensive. Fork the repository and put your solution inside of the src directory and include a way to run your tests!

### Examples

*Happy Case, exact inventory match!**

Input: `{ apple: 1 }, { owd: { apple: 1 } }`  
Output: `[{ owd: { apple: 1 } }]`

*Not enough inventory -> no allocations!*

Input: `{ apple: 1 }, { owd: { apple: 0 } }`  
Output: `[]`

*Should split an item across warehouses:*

Input: `{ apple: 10 }, { owd: { apple: 5 }, dm: { apple: 5 }}`  
Output: `[{ dm: { apple: 5 }, owd: { apple: 5 } }]`

*Should provide two suggestions if an item can go in either warehouse:*

Input: ```   
       ({ apple: 5, banana: 5, orange: 5 }, 
       { 
          owd: { apple: 5, orange: 10 }, 
          dm: { banana: 5, orange: 10 } 
       })```  
Output: `[{ dm: { banana: 5 }, owd: { apple: 5, orange: 5 } }]`

### What are we looking for

We'll evaluate your code via the following guidelines in no particular order:

1. **Readability**: naming, spacing, consistency
2. **Correctness**: is the solution correct and does it solve the problem
1. **Test Code Quality**: Is the test code comperehensive and covering all cases.
1. **Tool/Language mastery**: is the code using up to date syntax and techniques. 

