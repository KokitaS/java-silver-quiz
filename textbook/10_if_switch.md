# 10 if・switch文・switch式

> ひとことで言うと: `if` の条件は boolean だけ。`switch` は `break` を忘れると下へ「落ちる」。

読む目安: 8分 / 公式カテゴリ: 3 演算子・制御構造

## 基本

### if
- 条件は **boolean だけ**。`if (1)`、`if (x)`(int の x)はコンパイルエラー。
- `{ }` を省略すると、直後の**1文だけ**が if の対象。インデントに惑わされない。

```java
int x = 10;
if (x > 5)
    System.out.println("A");
    System.out.println("B");   // これは if の外。常に実行される
```

### switch 文
```java
public class Main {
    public static void main(String[] args) {
        int n = 2;
        switch (n) {
            case 1:
                System.out.println("one");
            case 2:
                System.out.println("two");     // ここから実行
            case 3:
                System.out.println("three");   // break がないので落ちてくる
                break;
            default:
                System.out.println("other");
        }
    }
}
// 出力: two
// 出力: three
```

- 使える型: `byte`、`short`、`char`、`int`(とそのラッパー)、`String`、`enum`。**`long`、`float`、`double`、`boolean` は不可**。
- `case` の値は**定数**で、重複はコンパイルエラー。
- `default` は途中に書いてもよい(どの case にも合わないときに入る)。
- `String` の比較は大文字小文字を区別する。

### switch 式(Java 14+)
`->` を使うと**値を返せて**、**落ちない**(break 不要)。

```java
public class Main {
    public static void main(String[] args) {
        int day = 3;
        String name = switch (day) {
            case 1, 7 -> "weekend";           // 複数の値をまとめられる
            case 2, 3, 4, 5, 6 -> "weekday";
            default -> "unknown";
        };
        System.out.println(name);

        int score = switch (day) {
            case 3 -> {
                int base = 10;
                yield base * 2;               // ブロックの中では yield で値を返す
            }
            default -> 0;
        };
        System.out.println(score);
    }
}
// 出力: weekday
// 出力: 20
```

- switch **式**は、**すべての値をカバー**する必要がある。`int` や `String` なら `default` が必須(ないとコンパイルエラー)。
- `enum` はすべての定数を書けば `default` なしでも OK。
- `->` と `:`(コロン形式)は、1つの switch の中で**混在させられない**。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `if (x = 5)`(x は int) | コンパイルエラー |
| `{ }` なしの if の2行目 | if の外(常に実行) |
| `switch (longValue)` | コンパイルエラー |
| `switch (boolean)` | コンパイルエラー |
| break なしの case | 次の case へ落ちる |
| 同じ case 値を2回 | コンパイルエラー |
| `->` 形式のフォールスルー | **落ちない** |
| switch 式で `default` なし(int) | コンパイルエラー |

## 確認ミニ問題

**Q1.** 出力は?
```java
int n = 1;
switch (n) {
    case 1: System.out.print("A");
    case 2: System.out.print("B"); break;
    case 3: System.out.print("C");
}
```
1. `A`
2. `AB`
3. `ABC`
4. `B`

<details><summary>答え</summary>

**2**。case 1 から入って、`break` のある case 2 の終わりまで実行。

</details>

**Q2.** コンパイルエラーになるのは?

1. `switch (str) { ... }`(String)
2. `switch (ch) { ... }`(char)
3. `switch (lng) { ... }`(long)
4. `switch (num) { ... }`(Integer)

<details><summary>答え</summary>

**3**。`long` は switch に使えない。

</details>

**Q3.** 出力は?
```java
int v = 2;
String r = switch (v) {
    case 1 -> "x";
    case 2 -> "y";
    default -> "z";
};
System.out.print(r);
```
1. `y`
2. `yz`
3. `xyz`
4. コンパイルエラー

<details><summary>答え</summary>

**1**。`->` 形式は落ちず、選ばれた1つだけ。

</details>
