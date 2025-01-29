---
outline: deep
---

### 索引签名

通过指定键和值的类型约束对象的结构，称为`索引签名`

```typescript
interface MyInterface {
    [key: string]: number;
}
```

`[key:string]`定义了对象的任意字符串类型的键都必须有一个对象的数字类型的值

#### 注意事项

1. **只读性**：默认情况，使用`索引签名`添加的属性是只读的，如果需要可写属性，可以在`索引签名`后添加一个额外属性

   ```typescript
   interface MyInterface {
       [key: string]: string; // 索引签名，所有值都是字符串
       name: string;
   }
   ```

2. **类型限制**：索引签名的类型可以限制为只接受特定类型的键和值

3. **可选和必选属性**：索引签名用于动态键名，也可以在接口中定义一些必选属性和可选属性

### 映射类型

一个类型基于另外一个类型，但是又不想拷贝一份，这时候可以使用映射类型

映射类型是基于`索引签名`的语法上，使用了`PropertyKeys`联合类型的泛型，其中`PropertyKeys`多是通过`keyof`创建，然后循环遍历键名创建一个类型

```typescript
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean
}
```

#### 映射修饰符

使用映射类型时，使用`readonly`设置属性只读，使用`?`设置属性可选

```typescript
// 删除属性中的只读属性
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
 
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
 
type UnlockedAccount = CreateMutable<LockedAccount>;

// type UnlockedAccount = {
//    id: string;
//    name: string;
// }

```

```typescript
// 删除属性中的可选属性
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
 
type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};
 
type User = Concrete<MaybeUser>;
// type User = {
//    id: string;
//    name: string;
//    age: number;
// }

```

#### 通过`as`实现键名重新映射

`ts4.1`之后可以，映射类型中使用`as`语句实现键名重新映射

```typescript
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

```typescript
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;

// type LazyPerson = {
//    getName: () => string;
//    getAge: () => number;
//    getLocation: () => string;
// }
```

使用条件类型返回一个`never`过滤某些属性

```typescript
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
 
interface Circle {
    kind: "circle";
    radius: number;
}
 
type KindlessCircle = RemoveKindField<Circle>;

// type KindlessCircle = {
//    radius: number;
// }

```

可以遍历任何联合类型

```typescript
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}
 
type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };
 
type Config = EventConfig<SquareEvent | CircleEvent>
// type Config = {
//    square: (event: SquareEvent) => void;
//    circle: (event: CircleEvent) => void;
// }
```

