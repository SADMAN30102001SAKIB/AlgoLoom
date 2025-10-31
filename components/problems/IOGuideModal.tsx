"use client";

interface IOGuideModalProps {
  language: string;
  onClose: () => void;
}

export function IOGuideModal({ language, onClose }: IOGuideModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Input/Output Guide - {language}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {language === "PYTHON" && <PythonGuide />}
          {language === "CPP" && <CppGuide />}
          {language === "JAVASCRIPT" && <JavaScriptGuide />}
          {language === "JAVA" && <JavaGuide />}
          {language === "C" && <CGuide />}
        </div>
      </div>
    </div>
  );
}

function PythonGuide() {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📥 Reading Input
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Single Integer"
            code={`n = int(input())  # Read one integer`}
          />
          <CodeExample
            title="Multiple Values (space-separated)"
            code={`# Two integers
a, b = map(int, input().split())  # "3 5" → a=3, b=5

# Array of integers
nums = list(map(int, input().split()))  # "2 7 11 15" → [2,7,11,15]

# Floats
x, y = map(float, input().split())  # "3.14 2.71"`}
          />
          <CodeExample
            title="String Input"
            code={`s = input()  # Read entire line
s = input().strip()  # Remove whitespace
words = input().split()  # Split into words`}
          />
          <CodeExample
            title="Array with Size"
            code={`n = int(input())  # Array size
nums = list(map(int, input().split()))  # n integers`}
          />
          <CodeExample
            title="Multiple Lines"
            code={`n = int(input())  # Number of lines
for i in range(n):
    line = input()
    # Process line`}
          />
          <CodeExample
            title="EOF (End of File)"
            code={`import sys

# Read all lines until EOF
for line in sys.stdin:
    data = line.strip()
    # Process data

# Or read everything at once
all_input = sys.stdin.read()
lines = all_input.strip().split('\\n')`}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📤 Writing Output
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Single Value"
            color="green"
            code={`print(result)  # Print any value
print(42)  # Print integer`}
          />
          <CodeExample
            title="Multiple Values (space-separated)"
            color="green"
            code={`print(a, b)  # "3 5"
print(*arr)  # [1,2,3] → "1 2 3"
print(' '.join(map(str, arr)))  # Manual`}
          />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">
          💡 Complete Example - Two Sum
        </h4>
        <pre className="bg-slate-950 p-3 rounded text-sm text-slate-300 overflow-x-auto">{`# Read input
n = int(input())  # Array size
nums = list(map(int, input().split()))  # Array
target = int(input())  # Target

# Solve
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        print(seen[complement], i)  # Space-separated
        break
    seen[num] = i`}</pre>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">
          ⚠️ Output Format Rules
        </h4>
        <ul className="text-sm text-slate-300 space-y-1 ml-4 list-disc">
          <li>
            Output must <strong>exactly match</strong> expected format
          </li>
          <li>Trailing spaces/newlines are usually okay</li>
          <li>Multiple values: space-separated unless specified</li>
          <li>Check problem statement for format requirements</li>
        </ul>
      </div>
    </>
  );
}

function JavaGuide() {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📥 Reading Input
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Setup"
            code={`import java.util.*;

Scanner sc = new Scanner(System.in);`}
          />
          <CodeExample
            title="Single Values"
            code={`int n = sc.nextInt();  // Integer
double d = sc.nextDouble();  // Double
String s = sc.next();  // Word
String line = sc.nextLine();  // Line`}
          />
          <CodeExample
            title="Array with Size"
            code={`int n = sc.nextInt();  // Array size
int[] arr = new int[n];
for (int i = 0; i < n; i++) {
    arr[i] = sc.nextInt();
}`}
          />
          <CodeExample
            title="EOF Detection"
            code={`while (sc.hasNext()) {
    int num = sc.nextInt();
    // Process num
}

while (sc.hasNextLine()) {
    String line = sc.nextLine();
    // Process line
}`}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📤 Writing Output
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Simple Output"
            color="green"
            code={`System.out.println(result);  // With newline
System.out.print(value);  // Without newline`}
          />
          <CodeExample
            title="Multiple Values"
            color="green"
            code={`System.out.println(a + " " + b);

// Array space-separated
for (int i = 0; i < arr.length; i++) {
    System.out.print(arr[i]);
    if (i < arr.length - 1) System.out.print(" ");
}
System.out.println();`}
          />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">
          💡 Complete Example - Two Sum
        </h4>
        <pre className="bg-slate-950 p-3 rounded text-sm text-slate-300 overflow-x-auto">{`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        
        // Solve
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                System.out.println(seen.get(complement) + " " + i);
                break;
            }
            seen.put(nums[i], i);
        }
        
        sc.close();
    }
}`}</pre>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">
          ⚠️ Common Pitfalls
        </h4>
        <ul className="text-sm text-slate-300 space-y-1 ml-4 list-disc">
          <li>
            <code>nextInt()</code> doesn&apos;t consume newline - use{" "}
            <code>nextLine()</code> after
          </li>
          <li>
            Always close Scanner: <code>sc.close();</code>
          </li>
          <li>
            Check <code>hasNext()</code> before reading
          </li>
        </ul>
      </div>
    </>
  );
}

function CppGuide() {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📥 Reading Input
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Setup"
            code={`#include <iostream>
#include <vector>
using namespace std;`}
          />
          <CodeExample
            title="Single Values"
            code={`int n;
cin >> n;  // Integer

double d;
cin >> d;  // Double

string word;
cin >> word;  // Word`}
          />
          <CodeExample
            title="Array with Size"
            code={`int n;
cin >> n;
vector<int> arr(n);
for (int i = 0; i < n; i++) {
    cin >> arr[i];
}`}
          />
          <CodeExample
            title="Reading Line"
            code={`string line;
getline(cin, line);

// After cin >> use:
cin.ignore();  // Skip newline
getline(cin, line);`}
          />
          <CodeExample
            title="EOF Detection"
            code={`int n;
while (cin >> n) {
    // Process n
}

string line;
while (getline(cin, line)) {
    // Process line
}`}
          />
          <CodeExample
            title="Fast I/O"
            code={`ios_base::sync_with_stdio(false);
cin.tie(NULL);
// Makes cin/cout faster`}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📤 Writing Output
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Simple Output"
            color="green"
            code={`cout << result << endl;  // With newline
cout << result << "\\n";  // Faster
cout << a << " " << b << endl;`}
          />
          <CodeExample
            title="Array"
            color="green"
            code={`for (int i = 0; i < arr.size(); i++) {
    cout << arr[i];
    if (i < arr.size() - 1) cout << " ";
}
cout << endl;`}
          />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">
          💡 Complete Example - Two Sum
        </h4>
        <pre className="bg-slate-950 p-3 rounded text-sm text-slate-300 overflow-x-auto">{`#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Read input
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    int target;
    cin >> target;
    
    // Solve
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            cout << seen[complement] << " " << i << endl;
            break;
        }
        seen[nums[i]] = i;
    }
    
    return 0;
}`}</pre>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Tips</h4>
        <ul className="text-sm text-slate-300 space-y-1 ml-4 list-disc">
          <li>
            After <code>cin &gt;&gt;</code>, use <code>cin.ignore()</code>{" "}
            before <code>getline()</code>
          </li>
          <li>
            Use <code>\\n</code> instead of <code>endl</code> for speed
          </li>
          <li>Enable fast I/O for competitive programming</li>
        </ul>
      </div>
    </>
  );
}

function JavaScriptGuide() {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📥 Reading Input
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Setup (Recommended)"
            code={`// Read all input at once
let input = require('fs').readFileSync(0, 'utf-8').trim();
let lines = input.split('\\n');`}
          />
          <CodeExample
            title="Parsing Values"
            code={`// Single integer
let n = parseInt(lines[0]);

// Multiple integers
let [a, b] = lines[0].split(' ').map(Number);

// Array of integers
let nums = lines[1].split(' ').map(Number);

// Float
let x = parseFloat(lines[0]);`}
          />
          <CodeExample
            title="Multiple Lines"
            code={`let n = parseInt(lines[0]);
for (let i = 1; i <= n; i++) {
    let line = lines[i];
    // Process line
}`}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📤 Writing Output
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Simple Output"
            color="green"
            code={`console.log(result);
console.log(a, b);  // Space-separated`}
          />
          <CodeExample
            title="Array"
            color="green"
            code={`console.log(arr.join(' '));  // "1 2 3"`}
          />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">
          💡 Complete Example - Two Sum
        </h4>
        <pre className="bg-slate-950 p-3 rounded text-sm text-slate-300 overflow-x-auto">{`// Read input
let input = require('fs').readFileSync(0, 'utf-8').trim();
let lines = input.split('\\n');

let n = parseInt(lines[0]);
let nums = lines[1].split(' ').map(Number);
let target = parseInt(lines[2]);

// Solve
let seen = new Map();
for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (seen.has(complement)) {
        console.log(seen.get(complement), i);
        break;
    }
    seen.set(nums[i], i);
}`}</pre>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Tips</h4>
        <ul className="text-sm text-slate-300 space-y-1 ml-4 list-disc">
          <li>
            Use <code>readFileSync(0, &apos;utf-8&apos;)</code> to read stdin
          </li>
          <li>
            <code>console.log(a, b)</code> auto-spaces arguments
          </li>
          <li>
            Always <code>.trim()</code> input
          </li>
        </ul>
      </div>
    </>
  );
}

function CGuide() {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📥 Reading Input
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Setup"
            code={`#include <stdio.h>
#include <stdlib.h>`}
          />
          <CodeExample
            title="Single Values"
            code={`int n;
scanf("%d", &n);  // Integer

double d;
scanf("%lf", &d);  // Double

char c;
scanf(" %c", &c);  // Char (note space)`}
          />
          <CodeExample
            title="Array with Size"
            code={`int n;
scanf("%d", &n);
int arr[n];
for (int i = 0; i < n; i++) {
    scanf("%d", &arr[i]);
}`}
          />
          <CodeExample
            title="EOF Detection"
            code={`int n;
while (scanf("%d", &n) != EOF) {
    // Process n
}

// Check return value
while (scanf("%d", &n) == 1) {
    // Successfully read
}`}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          📤 Writing Output
        </h3>
        <div className="space-y-4">
          <CodeExample
            title="Simple Output"
            color="green"
            code={`printf("%d\\n", result);
printf("%d %d\\n", a, b);`}
          />
          <CodeExample
            title="Array"
            color="green"
            code={`for (int i = 0; i < n; i++) {
    printf("%d", arr[i]);
    if (i < n - 1) printf(" ");
}
printf("\\n");`}
          />
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">
          💡 Complete Example - Two Sum
        </h4>
        <pre className="bg-slate-950 p-3 rounded text-sm text-slate-300 overflow-x-auto">{`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int* nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    
    int target;
    scanf("%d", &target);
    
    // Solve (brute force)
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                free(nums);
                return 0;
            }
        }
    }
    
    free(nums);
    return 0;
}`}</pre>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Tips</h4>
        <ul className="text-sm text-slate-300 space-y-1 ml-4 list-disc">
          <li>
            Always <code>free()</code> malloc&apos;d memory
          </li>
          <li>
            Use <code>&quot; %c&quot;</code> with space to skip whitespace
          </li>
          <li>
            Check <code>scanf</code> return value
          </li>
        </ul>
      </div>
    </>
  );
}

interface CodeExampleProps {
  title: string;
  code: string;
  color?: "purple" | "green";
}

function CodeExample({ title, code, color = "purple" }: CodeExampleProps) {
  const colorClass = color === "green" ? "text-green-400" : "text-purple-400";

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h4 className={`${colorClass} font-medium mb-2`}>{title}</h4>
      <pre className="bg-slate-950 p-3 rounded text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}
