---
title: pandas数据结构
tags:
  - 数据结构
  - Python
categories:
  - 笔记
date: 2024-07-23T23:20:00.000Z
slug: pandas数据结构
ascii_slug: pandas
---

构造 DataFrame 和 Series 的方法有多种。以下是一些常见的方法：

### 构造 DataFrame：

1. **从字典构造**：使用字典创建 DataFrame，字典的键是列名，值是列的数据。

```python
import pandas as pd

data = {'A': [1, 2, 3], 'B': [4, 5, 6]}
df = pd.DataFrame(data)
```

2. **从列表构造**：使用列表构造 DataFrame，每个子列表代表一行数据。

```python
data = [[1, 4], [2, 5], [3, 6]]
df = pd.DataFrame(data, columns=['A', 'B'])
```

3. **从 NumPy 数组构造**：使用 NumPy 数组构造 DataFrame。

```python
import numpy as np

data = np.array([[1, 4], [2, 5], [3, 6]])
df = pd.DataFrame(data, columns=['A', 'B'])
```

4. **从 Series 构造**：使用 Series 构造 DataFrame。

```python
s1 = pd.Series([1, 2, 3])
s2 = pd.Series([4, 5, 6])
df = pd.DataFrame({'A': s1, 'B': s2})
```

### 构造 Series：

1. **从列表构造**：使用列表构造 Series。

```python
s = pd.Series([1, 2, 3, 4])
```

2. **从 NumPy 数组构造**：使用 NumPy 数组构造 Series。

```python
import numpy as np

arr = np.array([1, 2, 3, 4])
s = pd.Series(arr)
```

3. **从字典构造**：使用字典构造 Series，字典的键作为索引。

```python
data = {'a': 1, 'b': 2, 'c': 3, 'd': 4}
s = pd.Series(data)
```

4. **从标量值构造**：使用标量值构造 Series，指定索引长度。

```python
s = pd.Series(5, index=['a', 'b', 'c'])
```

这些是构造 DataFrame 和 Series 最常见的方法，根据数据的来源和形式选择合适的构造方式。



---

在 Pandas 中，`iloc`、`loc`、`at` 和 `iat` 是用于访问数据的四种方法，它们之间的区别和使用方法如下：

1. `iloc`：通过整数位置来访问数据。你可以使用行号和列号来获取数据。行和列的编号都是从 0 开始的。

```python
import pandas as pd

# 创建一个示例 DataFrame
df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

# 通过整数位置访问数据
print(df.iloc[0, 1])  # 输出第 0 行、第 1 列的元素，这里输出的是 4
```

2. `loc`：通过标签来访问数据。你可以使用行标签和列标签来获取数据。

```python
# 使用 loc 访问数据
print(df.loc[0, 'B'])  # 输出第 0 行、'B' 列的元素，这里输出的是 4
```

3. `at`：通过标签快速访问标量值。类似于 `loc`，但 `at` 只能用于获取单个元素，速度更快。

```python
# 使用 at 访问单个元素
print(df.at[0, 'B'])  # 输出第 0 行、'B' 列的元素，这里输出的是 4
```

4. `iat`：通过整数位置快速访问标量值。类似于 `iloc`，但 `iat` 只能用于获取单个元素，速度更快。

```python
# 使用 iat 访问单个元素
print(df.iat[0, 1])  # 输出第 0 行、第 1 列的元素，这里输出的是 4
```

总结一下：

- 当你知道你要访问的数据的位置时，使用 `iloc` 和 `iat`，它们更快。其中iat获取单个元素
- 当你知道你要访问的数据的标签时，使用 `loc` 和 `at`，它们更直观。其中at获取单个元素
