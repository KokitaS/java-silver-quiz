# 07 ArrayList

> ひとことで言うと: 長さが変えられる配列。ただし「ループ中に勝手に消す」と実行時エラーになる。

読む目安: 8分 / 公式カテゴリ: 2 基本データ型・文字列 / 弱点: ConcurrentModificationException

## 基本

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();   // 型は <> で指定。右側は省略(ダイヤモンド)
        list.add("A");
        list.add("B");
        list.add(1, "X");                // 位置を指定して挿入
        list.add(null);                  // null も入る
        System.out.println(list);
        System.out.println(list.size());
        System.out.println(list.get(0));
        list.set(0, "Z");                // 置き換え
        System.out.println(list.contains("B"));
        System.out.println(list.indexOf("Q"));   // なければ -1
    }
}
// 出力: [A, X, B, null]
// 出力: 4
// 出力: A
// 出力: true
// 出力: -1
```

- 要素の数は `size()`(配列の `length`、`String` の `length()` と使い分ける)。
- `ArrayList<int>` は不可。**ラッパー型**(`Integer`)を使う。
- 範囲外のインデックスは実行時 `IndexOutOfBoundsException`。

### remove は2種類ある(頻出)
```java
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3));
        list.remove(1);                       // int → 「位置1」を削除 → [1, 3]
        System.out.println(list);
        list.remove(Integer.valueOf(1));      // Integer → 「値1」を削除 → [3]
        System.out.println(list);
    }
}
// 出力: [1, 3]
// 出力: [3]
```

### ループ中に削除すると…
拡張 for の途中で `list.remove(...)` すると、**実行時に ConcurrentModificationException**(コンパイルは通る)。安全に消すなら `Iterator` の `remove()`。

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>(Arrays.asList("a", "b", "c"));
        Iterator<String> it = list.iterator();
        while (it.hasNext()) {
            if (it.next().equals("b")) it.remove();     // これなら安全
        }
        System.out.println(list);
    }
}
// 出力: [a, c]
```

(`removeIf` も安全。ただしラムダ式を使うので、試験範囲外の書き方として「条件が true の要素が**削除される**」ことだけ覚える。)

### 固定サイズ・変更不可のリスト
- `Arrays.asList(...)` は**要素の追加・削除ができない**(`UnsupportedOperationException`)。要素の置き換え(`set`)は可。
- `List.of(...)` は**変更不可**(追加・削除・置き換えのすべてが `UnsupportedOperationException`)。`null` を入れると `NullPointerException`。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `list.remove(1)`(`List<Integer>`) | 位置1を削除。値を消すなら `remove(Integer.valueOf(1))` |
| 拡張 for の中で `remove` | **実行時** ConcurrentModificationException(コンパイルエラーではない) |
| `ArrayList<int>` | コンパイルエラー |
| `list.add(null)` | OK |
| `List.of(1, 2).add(3)` | 実行時 UnsupportedOperationException |
| `list.length` / `list.length()` | コンパイルエラー(`size()`) |
| `removeIf` | 条件が true の要素を**消す**(残すのではない) |

## 確認ミニ問題

**Q1.** 出力は?
```java
ArrayList<Integer> list = new ArrayList<>(java.util.Arrays.asList(5, 6, 7));
list.remove(1);
System.out.println(list);
```
1. `[6, 7]`
2. `[5, 7]`
3. `[5, 6]`
4. 実行時エラー

<details><summary>答え</summary>

**2**。`remove(1)` は `int` 引数なので「位置1」を削除。

</details>

**Q2.** 拡張 for の中で `list.remove(s)` を呼んだ結果は?

1. コンパイルエラー
2. 正常に削除される
3. 実行時に ConcurrentModificationException
4. 何も起きない

<details><summary>答え</summary>

**3**。コンパイルは通り、実行時に例外になる。

</details>

**Q3.** 実行時に `UnsupportedOperationException` になるのは?

1. `new ArrayList<>().add(1)`
2. `java.util.List.of(1, 2).add(3)`
3. `new ArrayList<String>().add(null)`
4. `new ArrayList<Integer>().size()`

<details><summary>答え</summary>

**2**。`List.of` は変更不可。1・3・4 は問題なく動く。

</details>
