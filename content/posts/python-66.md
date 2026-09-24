---
title: 详解Python的66个内置函数
tags:
  - Python
categories:
  - 笔记
date: 2024-10-21T19:07:00.000Z
slug: 详解Python的66个内置函数
ascii_slug: python-66
---

![Python 内置函数分类](/images/posts/python-builtins/overview.svg)

Python 之所以被称为强大且易用，离不开其丰富的内置函数。这些函数可以大大简化我们日常的编程任务，无需额外安装任何库即可使用。

Python 共有 66 个内置函数，本文将通过直观的解释和示例代码，带你逐个了解它们的功能和用法。


## **一、数学与数值处理**

#### **1. `abs(x)`**

- **功能**：返回数值的绝对值。

- 示例

	```python
	x = -10
	print(abs(x))  # 输出：10
	```

#### **2. `all(iterable)`**

- **功能**：若可迭代对象中的所有元素都为真，返回 `True`，否则返回 `False`。

- 示例

	```python
	iterable = [True, True, False]
	print(all(iterable))  # 输出：False
	```

#### **3. `any(iterable)`**

- **功能**：若可迭代对象中至少有一个元素为真，返回 `True`，否则返回 `False`。

- 示例

	```python
	iterable = [False, False, True]
	print(any(iterable))  # 输出：True
	```

#### **4. `bin(x)`**

- **功能**：将整数转换为二进制字符串。

- 示例

	```python
	x = 10
	print(bin(x))  # 输出：0b1010
	```

#### **5. `bool(x)`**

- **功能**：将值转换为布尔类型。

- 示例

	```python
	x = 0
	print(bool(x))  # 输出：False
	```

#### **6. `divmod(a, b)`**

- **功能**：返回两个数的商和余数。

- 示例

	```python
	a, b = 10, 3
	result = divmod(a, b)
	print(result)  # 输出：(3, 1)
	```

#### **7. `float(x)`**

- **功能**：将一个数转换为浮点数。

- 示例

	```python
	x = 10
	print(float(x))  # 输出：10.0
	```

#### **8. `int(x)`**

- **功能**：将值转换为整数。

- 示例

	```python
	x = 3.14
	print(int(x))  # 输出：3
	```

#### **9. `max(iterable[, key])`**

- **功能**：返回可迭代对象中的最大值。

- 示例

	```python
	numbers = [3, 1, 4, 2, 5]
	print(max(numbers))  # 输出：5
	```

#### **10. `min(iterable[, key])`**

- **功能**：返回可迭代对象中的最小值。

- 示例

	```python
	numbers = [3, 1, 4, 2, 5]
	print(min(numbers))  # 输出：1
	```

#### **11. `pow(x, y[, z])`**

- **功能**：返回 `x` 的 `y` 次幂，如果提供了 `z`，则返回结果对 `z` 取模。

- 示例

	```python
	x, y, z = 2, 3, 5
	result = pow(x, y, z)
	print(result)  # 输出：3
	```

#### **12. `round(number[, ndigits])`**

- **功能**：对数值进行四舍五入。

- 示例

	```python
	x = 3.14159
	print(round(x, 2))  # 输出：3.14
	```

#### **13. `sum(iterable[, start])`**

- **功能**：返回可迭代对象中元素的总和。

- 示例

	```python
	numbers = [1, 2, 3, 4, 5]
	print(sum(numbers))  # 输出：15
	```

------

## **二、字符串与字符处理**

#### **14. `chr(i)`**

- **功能**：返回整数 `i` 对应的 Unicode 字符。

- 示例

	```python
	i = 65
	print(chr(i))  # 输出：A
	```

#### **15. `ord(c)`**

- **功能**：返回字符的 Unicode 编码。

- 示例

	```python
	c = 'A'
	print(ord(c))  # 输出：65
	```

#### **16. `repr(object)`**

- **功能**：返回对象的字符串表示，通常用于调试。

- 示例

	```python
	s = "Hello"
	print(repr(s))  # 输出：'Hello'
	```

#### **17. `str(object='')`**

- **功能**：将对象转换为字符串。

- 示例

	```python
	x = 10
	print(str(x))  # 输出：'10'
	```

------

## **三、序列操作**

#### **18. `list([iterable])`**

- **功能**：将可迭代对象转换为列表。

- 示例

	```python
	iterable = (1, 2, 3)
	lst = list(iterable)
	print(lst)  # 输出：[1, 2, 3]
	```

#### **19. `tuple([iterable])`**

- **功能**：将可迭代对象转换为元组。

- 示例

	```python
	iterable = [1, 2, 3]
	t = tuple(iterable)
	print(t)  # 输出：(1, 2, 3)
	```

#### **20. `set([iterable])`**

- **功能**：将可迭代对象转换为集合。

- 示例

	```python
	iterable = [1, 2, 3]
	s = set(iterable)
	print(s)  # 输出：{1, 2, 3}
	```

#### **21. `frozenset([iterable])`**

- **功能**：创建一个不可变集合。

- 示例

	```python
	iterable = [1, 2, 3]
	fs = frozenset(iterable)
	print(fs)  # 输出：frozenset({1, 2, 3})
	```

#### **22. `sorted(iterable[, key][, reverse])`**

- **功能**：返回排序后的列表。

- 示例

	```python
	numbers = [3, 1, 4, 2, 5]
	sorted_numbers = sorted(numbers)
	print(sorted_numbers)  # 输出：[1, 2, 3, 4, 5]
	```

#### **23. `zip(*iterables)`**

- **功能**：将多个可迭代对象中的元素打包成元组。

- 示例

	```python
	numbers = [1, 2, 3]
	letters = ['a', 'b', 'c']
	zipped = zip(numbers, letters)
	print(list(zipped))  # 输出：[(1, 'a'), (2, 'b'), (3, 'c')]
	```

#### **24. `input([prompt])`**

- **功能**：从用户处接收输入，返回一个字符串。

- 示例

	```python
	name = input("请输入您的姓名：")
	print("您好，" + name + "！")
	```

#### **25. `print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False)`**

- **功能**：输出到控制台。

- 示例

	```python
	name = "xuanz"
	age = 20
	print("My name is", name, "and I am", age, "years old.")
	# 输出：My name is xuanz and I am 20 years old.
	```

#### **26. `open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)`**

- **功能**：打开文件并返回文件对象。

- 示例

	```python
	file = open("example.txt", "w")
	file.write("Hello, World!")
	file.close()
	```

------

## **五、反射与动态执行**

#### **27. `eval(expression[, globals[, locals]])`**

- **功能**：执行字符串表达式并返回结果。

- 示例

	```python
	expression = "2 + 3"
	result = eval(expression)
	print(result)  # 输出：5
	```

#### **28. `exec(object[, globals[, locals]])`**

- **功能**：执行 Python 代码。

- 示例

	```python
	code = """
	x = 5
	if x > 0:
	    print("Positive")
	"""
	exec(code)  # 输出：Positive
	```

## **六、面向对象与反射**

#### **29. `callable(object)`**

- **功能**：检查对象是否可调用（如函数或方法）。

- 示例

	```python
	def func():
	    pass
	
	print(callable(func))  # 输出：True
	```

#### **30. `classmethod(function)`**

- **功能**：将一个函数转换为类方法。

- 示例

	```python
	class MyClass:
	    attr = 10
	    @classmethod
	    def class_method(cls):
	        return cls.attr
	
	print(MyClass.class_method())  # 输出：10
	```

#### **31. `delattr(object, name)`**

- **功能**：删除对象的属性。

- 示例

	```python
	class MyClass:
	    attr = 10
	
	obj = MyClass()
	delattr(obj, 'attr')
	print(hasattr(obj, 'attr'))  # 输出：False
	```

#### **32. `getattr(object, name[, default])`**

- **功能**：返回对象属性的值。

- 示例

	```python
	class MyClass:
	    attr = 10
	
	obj = MyClass()
	print(getattr(obj, 'attr'))  # 输出：10
	```

#### **33. `setattr(object, name, value)`**

- **功能**：设置对象的属性值。

- 示例

	```python
	class MyClass:
	    attr = 10
	
	obj = MyClass()
	setattr(obj, 'attr', 20)
	print(obj.attr)  # 输出：20
	```

#### **34. `hasattr(object, name)`**

- **功能**：检查对象是否有指定属性。

- 示例

	```python
	class MyClass:
	    attr = 10
	
	obj = MyClass()
	print(hasattr(obj, 'attr'))  # 输出：True
	```

#### **35. `property(fget=None, fset=None, fdel=None, doc=None)`**

- **功能**：创建对象的属性。

- 示例

	```python
	class MyClass:
	    def __init__(self):
	        self._attr = 0
	    
	    @property
	    def attr(self):
	        return self._attr
	    
	    @attr.setter
	    def attr(self, value):
	        self._attr = value
	
	obj = MyClass()
	obj.attr = 10
	print(obj.attr)  # 输出：10
	```

#### **36. `staticmethod(function)`**

- **功能**：将函数转换为静态方法。

- 示例

	```python
	class MyClass:
	    @staticmethod
	    def my_method():
	        return "This is a static method."
	
	print(MyClass.my_method())  # 输出：This is a static method.
	```

#### **37. `super([type[, object-or-type]])`**

- **功能**：返回父类的对象。

- 示例

	```python
	class Parent:
	    def __init__(self):
	        self.attr = 10
	
	class Child(Parent):
	    def __init__(self):
	        super().__init__()
	
	child = Child()
	print(child.attr)  # 输出：10
	```

#### **38. `vars([object])`**

- **功能**：返回对象属性及属性值的字典。

- 示例

	```python
	class MyClass:
	    attr = 10
	
	obj = MyClass()
	print(vars(obj))  # 输出：{'attr': 10}
	```

#### **39. `type(object)`**

- **功能**：返回对象的类型。

- 示例

	```python
	x = 10
	print(type(x))  # 输出：<class 'int'>
	```

#### **40. `isinstance(object, classinfo)`**

- **功能**：检查对象是否是指定类或类型的实例。

- 示例

	```python
	class MyClass:
	    pass
	
	obj = MyClass()
	print(isinstance(obj, MyClass))  # 输出：True
	```

#### **41. `issubclass(class, classinfo)`**

- **功能**：检查一个类是否是另一个类的子类。

- 示例

	```python
	class Parent:
	    pass
	
	class Child(Parent):
	    pass
	
	print(issubclass(Child, Parent))  # 输出：True
	```

------

## **七、数据结构操作**

#### **42. `bytearray([source[, encoding[, errors]]])`**

- **功能**：创建一个可变字节数组对象。

- 示例

	```python
	source = b'Hello'
	arr = bytearray(source)
	print(arr)  # 输出：bytearray(b'Hello')
	```

#### **43. `bytes([source[, encoding[, errors]]])`**

- **功能**：创建一个不可变字节对象。

- 示例

	```python
	source = 'Hello'
	b = bytes(source, encoding='utf-8')
	print(b)  # 输出：b'Hello'
	```

#### **44. `dict([arg])`**

- **功能**：创建一个字典。

- 示例

	```python
	d = dict(a=1, b=2, c=3)
	print(d)  # 输出：{'a': 1, 'b': 2, 'c': 3}
	```

#### **45. `slice(stop)`**

- **功能**：创建一个切片对象。

- 示例

	```python
	numbers = [1, 2, 3, 4, 5]
	s = slice(2)
	print(numbers[s])  # 输出：[1, 2]
	```

#### **46. `enumerate(iterable, start=0)`**

- **功能**：返回一个枚举对象，包含索引和值。

- 示例

	```python
	iterable = ['a', 'b', 'c']
	for i, value in enumerate(iterable):
	    print(i, value)
	```

#### **47. `filter(function, iterable)`**

- **功能**：过滤可迭代对象中的元素。

- 示例

	```python
	def is_positive(x):
	    return x > 0
	
	numbers = [1, -2, 3, -4, 5]
	result = filter(is_positive, numbers)
	print(list(result))  # 输出：[1, 3, 5]
	```

#### **48. `map(function, iterable, ...)`**

- **功能**：对可迭代对象中的每个元素应用函数。

- 示例

	```python
	def square(x):
	    return x ** 2
	
	numbers = [1, 2, 3, 4, 5]
	result = map(square, numbers)
	print(list(result))  # 输出：[1, 4, 9, 16, 25]
	```

#### **49. `iter(object[, sentinel])`**

- **功能**：创建一个迭代器对象。

- 示例

	```python
	iterable = [1, 2, 3]
	iterator = iter(iterable)
	print(next(iterator))  # 输出：1
	```

#### **50. `next(iterator[, default])`**

- **功能**：返回迭代器中的下一个元素。

- 示例

	```python
	iterable = [1, 2, 3]
	iterator = iter(iterable)
	print(next(iterator))  # 输出：1
	```

#### **51. `reversed(seq)`**

- **功能**：返回一个反向的迭代器对象。

- 示例

	```python
	seq = [1, 2, 3]
	rev_seq = reversed(seq)
	print(list(rev_seq))  # 输出：[3, 2, 1]
	```

#### **52. `memoryview(obj)`**

- **功能**：创建一个内存视图对象，用于访问其他对象的内存。

- 示例

	```python
	b = bytes([1, 2, 3, 4, 5])
	mv = memoryview(b)
	print(mv[0])  # 输出：1
	```

------

## **八、其他内置函数**

#### **53. `oct(x)`**

- **功能**：将整数转换为八进制字符串。

- 示例

	```python
	x = 8
	print(oct(x))  # 输出：0o10
	```

#### **54. `hex(x)`**

- **功能**：将整数转换为十六进制字符串。

- 示例

	```python
	x = 255
	print(hex(x))  # 输出：0xff
	```

#### **55. `globals()`**

- **功能**：返回当前全局作用域的字典。

- 示例

	```python
	print(globals())
	```

#### **56. `locals()`**

- **功能**：返回当前局部作用域的字典。

- 示例

	```python
	print(locals())
	```

#### **57. `id(object)`**

- **功能**：返回对象的唯一标识符。

- 示例

	```python
	x = 10
	print(id(x))
	```

#### **58. `range(stop)`**

- **功能**：返回一个包含从 0 到 stop-1 的整数序列的可迭代对象。

- 示例

	```python
	for i in range(5):
	    print(i)
	```

#### **59. `open(file, mode='r', ...)`**

- **功能**：打开文件并返回文件对象。

- 示例

	```python
	with open("example.txt", "w") as file:
	    file.write("Hello, World!")
	```

#### **60. `eval(expression)`**

- **功能**：执行字符串表达式并返回结果。

- 示例

	```python
	expression = "2 + 3"
	result = eval(expression)
	print(result)  # 输出：5
	```

#### **61. `exec(object)`**

- **功能**：执行 Python 代码。

- 示例

	```python
	code = """
	x = 5
	if x > 0:
	    print("Positive")
	"""
	exec(code)  # 输出：Positive
	```

#### **62. `compile(source, filename, mode)`**

- **功能**：编译源代码为代码或 AST 对象。

- 示例

	```python
	source = "print('Hello, World!')"
	code = compile(source, filename="", mode="exec")
	exec(code)  # 输出：Hello, World!
	```

#### **63. `input([prompt])`**

- **功能**：从用户处接收输入，返回字符串。

- 示例

	```python
	name = input("请输入您的姓名：")
	print("您好，" + name + "！")
	```

#### **64. `object()`**

- **功能**：返回一个新的空对象。

- 示例

	```python
	obj = object()
	print(obj)
	```

#### **65. `help([object])`**

- **功能**：获取对象的帮助信息。

- 示例

	```python
	help(list)
	```

#### **66. `complex([real[, imag]])`**

- **功能**：创建一个复数。

- 示例

	```python
	c = complex(3, 4)
	print(c)  # 输出：(3+4j)
	```

Python 的 66 个内置函数是编程的基础工具，可以简化代码编写，提升开发效率。掌握这些函数后，你将能够更轻松地完成各种编程任务。
