---
outline: deep
---
### 枚举类型

#### 数字枚举

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```

如上，我们定义了一个数字枚举，`Up`使用初始化为`1`。 其余的成员会从`1`开始自动增长。 换句话说，`Direction.Up`的值为`1`，`Down`为`2`，`Left`为`3`，`Right`为`4`。

#### 字符串枚举

我们还可以完全不使用初始化器：

```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

现在，`Up`的值为`0`，`Down`的值为`1`等等。 当我们不在乎成员的值的时候，这种自增长的行为是很有用处的，但是要注意每个枚举成员的值都是不同的。

使用枚举很简单：通过枚举的属性来访问枚举成员，和枚举的名字来访问枚举类型：

```typescript
enum Response {
    No = 0,
    Yes = 1,
}

function respond(recipient: string, message: Response): void {
    // ...
}

respond("Princess Caroline", Response.Yes)
```

数字枚举可以被混入到[计算过的和常量成员（如下所示）](https://ts.yayujs.com/reference/enums.html#computed-and-constant-members)。 简短地说，没有初始化器的成员要么在首位，要么必须在用数值常量或其他常量枚举成员初始化的数值枚举之后。 换句话说，下面的情况是不被允许的：

```typescript
enum E {
    A = getSomeValue(),
    B, // Error! Enum member must have initializer.
}
```

#### 异构枚举

从技术的角度来说，枚举可以混合字符串和数字成员，但是似乎你并不会这么做：

```typescript
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

除非你真的想要利用JavaScript运行时的行为，否则我们不建议这样做。

#### 计算的和常量成员

每个枚举成员都带有一个值，它可以是_常量_或_计算出来的_。 当满足如下条件时，枚举成员被当作是常量：

- 它是枚举的第一个成员且没有初始化器，这种情况下它被赋予值`0`：

  ```typescript
  // E.X is constant:
  enum E { X }
  ```

- 它不带有初始化器且它之前的枚举成员是一个_数字_常量。 这种情况下，当前枚举成员的值为它上一个枚举成员的值加1。

  ```typescript
  // All enum members in 'E1' and 'E2' are constant.
  
  enum E1 { X, Y, Z }
  
  enum E2 {
      A = 1, B, C
  }
  ```

- 枚举成员使用_常量枚举表达式_初始化。 常量枚举表达式是TypeScript表达式的子集，它可以在编译阶段求值。 当一个表达式满足下面条件之一时，它就是一个常量枚举表达式：

  1. 一个枚举表达式字面量（主要是字符串字面量或数字字面量）
  2. 一个对之前定义的常量枚举成员的引用（可以是在不同的枚举类型中定义的）
  3. 带括号的常量枚举表达式
  4. 一元运算符`+`, `-`, `~`其中之一应用在了常量枚举表达式
  5. 常量枚举表达式做为二元运算符`+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`的操作对象。

  若常量枚举表达式求值后为`NaN`或`Infinity`，则会在编译阶段报错。

所有其它情况的枚举成员被当作是需要计算得出的值。

```typescript
enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
```

#### 联合枚举与枚举成员的类型

存在一种特殊的非计算的常量枚举成员的子集：字面量枚举成员。 字面量枚举成员是指不带有初始值的常量枚举成员，或者是值被初始化为

- 任何字符串字面量（例如：`"foo"`，`"bar"`，`"baz"`）
- 任何数字字面量（例如：`1`, `100`）
- 应用了一元`-`符号的数字字面量（例如：`-1`, `-100`）

当所有枚举成员都拥有字面量枚举值时，它就带有了一种特殊的语义。

首先，枚举成员成为了类型！ 例如，我们可以说某些成员_只能_是枚举成员的值：

```typescript
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square, // Error! Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
    radius: 100,
}
```

另一个变化是枚举类型本身变成了每个枚举成员的_联合_。 

```typescript
enum E {
    Foo,
    Bar,
}

function f(x: E) {
    if (x !== E.Foo || x !== E.Bar) {
        //             ~~~~~~~~~~~
        // Error! This condition will always return 'true' since the types 'E.Foo' and 'E.Bar' have no overlap.
    }
}
```

这个例子里，我们先检查`x`是否不是`E.Foo`。 如果通过了这个检查，然后`||`会发生短路效果，`if`语句体里的内容会被执行。 然而，这个检查没有通过，那么`x`则_只能_为`E.Foo`，因此没理由再去检查它是否为`E.Bar`。

#### 运行时的枚举

枚举是在运行时真正存在的对象。 例如下面的枚举：

```typescript
enum E {
    X, Y, Z
}
```

可以传递给函数

```typescript
function f(obj: { X: number }) {
    return obj.X;
}

// 没问题，因为 'E'包含一个数值型属性'X'。
f(E);
```

#### 编译时的枚举

尽管一个枚举是在运行时真正存在的对象，但`keyof`关键字的行为与其作用在对象上时有所不同。应该使用`keyof typeof`来获取一个表示枚举里所有字符串`key`的类型。

```typescript
enum LogLevel {
    ERROR, WARN, INFO, DEBUG
}

/**
 * 等同于：
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
    const num = LogLevel[key];
    if (num <= LogLevel.WARN) {
       console.log('Log level key is: ', key);
       console.log('Log level value is: ', num);
       console.log('Log level message is: ', message);
    }
}
printImportant('ERROR', 'This is a message');
```

#### 反向映射

除了创建一个以属性名做为对象成员的对象之外，数字枚举成员还具有了_反向映射_，从枚举值到枚举名字。 例如，在下面的例子中：

```typescript
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

TypeScript可能会将这段代码编译为下面的JavaScript：

```javascript
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

生成的代码中，枚举类型被编译成一个对象，它包含了正向映射（`name` -> `value`）和反向映射（`value` -> `name`）。 引用枚举成员总会生成为对属性访问并且永远也不会内联代码。

要注意的是_不会_为字符串枚举成员生成反向映射。

#### `const`枚举

大多数情况下，枚举是十分有效的方案。 然而在某些情况下需求很严格。 为了避免在额外生成的代码上的开销和额外的非直接的对枚举成员的访问，我们可以使用`const`枚举。 常量枚举通过在枚举上使用`const`修饰符来定义。

```typescript
const enum Enum {
    A = 1,
    B = A * 2
}
```

常量枚举只能使用常量枚举表达式，并且不同于常规的枚举，它们在编译阶段会被删除。 常量枚举成员在使用的地方会被内联进来。 之所以可以这么做是因为，常量枚举不允许包含计算成员。

```typescript
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```

生成后的代码为：

```javascript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

### 命名空间

#### 关于验证器

```typescript
interface StringValidator {
    isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}

class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: StringValidator; } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        let isMatch = validators[name].isAcceptable(s);
        console.log(`'${ s }' ${ isMatch ? "matches" : "does not match" } '${ name }'.`);
    }
}
```

如上所示，随着更多验证器的加入，需要一种方式重新组织代码，便于记录类型同时不发生命名冲突。所以我们需要用到命名空间

#### 命名空间的使用

```typescript
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
```

#### 多文件的命名空间

现在，我们把`Validation`命名空间分割成多个文件。 尽管是不同的文件，它们仍是同一个命名空间，并且在使用的时候就如同它们在一个文件中定义的一样。 因为不同文件之间存在依赖关系，所以我们加入了引用标签来告诉编译器文件之间的关联。 我们的测试代码保持不变。

**Validation.ts**

```typescript
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
```

**LettersOnlyValidator.ts**

```typescript
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```

**ZipCodeValidator.ts**

```typescript
/// <reference path="Validation.ts" />
namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```

**Test.ts**

```typescript
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
```

当涉及到多文件时，我们必须确保所有编译后的代码都被加载了。 我们有两种方式。

第一种方式，把所有的输入文件编译为一个输出文件，需要使用`--outFile`标记：

```text
tsc --outFile sample.js Test.ts
```

编译器会根据源码里的引用标签自动地对输出进行排序。你也可以单独地指定每个文件。

```text
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

第二种方式，我们可以编译每一个文件（默认方式），那么每个源文件都会对应生成一个JavaScript文件。 然后，在页面上通过`<script>`标签把所有生成的JavaScript文件按正确的顺序引进来，比如：

**MyTestPage.html** 

```markup
    <script src="Validation.js" type="text/javascript" />
    <script src="LettersOnlyValidator.js" type="text/javascript" />
    <script src="ZipCodeValidator.js" type="text/javascript" />
    <script src="Test.js" type="text/javascript" />
```

### 三斜线指令

三斜线指令是包含单个XML标签的单行注释。 注释的内容会做为编译器指令使用。

三斜线指令_仅_可放在包含它的文件的最顶端。 一个三斜线指令的前面只能出现单行或多行注释，这包括其它的三斜线指令。 如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。

#### `/// <reference path="..." />`

`/// <reference path="..." />`指令是三斜线指令中最常见的一种。 它用于声明文件间的_依赖_。

三斜线引用告诉编译器在编译过程中要引入的额外的文件。

当使用`--out`或`--outFile`时，它也可以做为调整输出内容顺序的一种方法。 文件在输出文件内容中的位置与经过预处理后的输入顺序一致。

#### 预处理输入文件

编译器会对输入文件进行预处理来解析所有三斜线引用指令。 在这个过程中，额外的文件会加到编译过程中。

这个过程会以一些_根文件_开始； 它们是在命令行中指定的文件或是在`tsconfig.json`中的`"files"`列表里的文件。 这些根文件按指定的顺序进行预处理。 在一个文件被加入列表前，它包含的所有三斜线引用都要被处理，还有它们包含的目标。 三斜线引用以它们在文件里出现的顺序，使用深度优先的方式解析。

一个三斜线引用路径是相对于包含它的文件的，如果不是根文件。

#### 错误

引用不存在的文件会报错。 一个文件用三斜线指令引用自己会报错。

#### 使用 `--noResolve`

如果指定了`--noResolve`编译选项，三斜线引用会被忽略；它们不会增加新文件，也不会改变给定文件的顺序。

#### `/// <reference types="..." />`

与`/// <reference path="..." />`指令相似（用于声明_依赖_），`/// <reference types="..." />`指令声明了对某个包的依赖。

对这些包的名字的解析与在`import`语句里对模块名的解析类似。 可以简单地把三斜线类型引用指令当做`import`声明的包。

例如，把`/// <reference types="node" />`引入到声明文件，表明这个文件使用了`@types/node/index.d.ts`里面声明的名字； 并且，这个包需要在编译阶段与声明文件一起被包含进来。

仅当在你需要写一个`d.ts`文件时才使用这个指令。

对于那些在编译阶段生成的声明文件，编译器会自动地添加`/// <reference types="..." />`； _当且仅当_结果文件中使用了引用的包里的声明时才会在生成的声明文件里添加`/// <reference types="..." />`语句。

若要在`.ts`文件里声明一个对`@types`包的依赖，使用`--types`命令行选项或在`tsconfig.json`里指定。 查看[在`tsconfig.json`里使用`@types`，`typeRoots`和`types`](https://ts.yayujs.com/project-config/tsconfig.json.html#types-typeroots-and-types)了解详情。

#### `/// <reference no-default-lib="true"/>`

这个指令把一个文件标记成_默认库_。 你会在`lib.d.ts`文件和它不同的变体的顶端看到这个注释。

这个指令告诉编译器在编译过程中_不要_包含这个默认库（比如，`lib.d.ts`）。 这与在命令行上使用`--noLib`相似。

还要注意，当传递了`--skipDefaultLibCheck`时，编译器只会忽略检查带有`/// <reference no-default-lib="true"/>`的文件。

#### `/// <amd-module />`

默认情况下生成的AMD模块都是匿名的。 但是，当一些工具需要处理生成的模块时会产生问题，比如`r.js`。

`amd-module`指令允许给编译器传入一个可选的模块名：

#### amdModule.ts

```typescript
///<amd-module name='NamedModule'/>
export class C {
}
```

这会将`NamedModule`传入到AMD `define`函数里：

#### amdModule.js

```javascript
define("NamedModule", ["require", "exports"], function (require, exports) {
    var C = (function () {
        function C() {
        }
        return C;
    })();
    exports.C = C;
});
```

#### `/// <amd-dependency />`

> **注意**：这个指令被废弃了。使用`import "moduleName";`语句代替。

`/// <amd-dependency path="x" />`告诉编译器有一个非TypeScript模块依赖需要被注入，做为目标模块`require`调用的一部分。

`amd-dependency`指令也可以带一个可选的`name`属性；它允许我们为amd-dependency传入一个可选名字：

```typescript
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA:MyType
moduleA.callStuff()
```

生成的JavaScript代码：

```javascript
define(["require", "exports", "legacy/moduleA"], function (require, exports, moduleA) {
    moduleA.callStuff()
});
```
