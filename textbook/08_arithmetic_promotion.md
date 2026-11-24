# 08 算術演算・インクリメント・代入・数値プロモーション

> ひとことで言うと: 計算は「小さい型 → int」に引き上げられてから行われる。`int` 同士の割り算は `int`。

読む目安: 8分 / 公式カテゴリ: 3 演算子・制御構造 / 弱点: int/int 除算・byte+byte・後置インクリメント

## 基本

### 割り算と余り
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(5 / 2);              // int 同士 → 2
        System.out.println(5 / 2.0);            // 片方が double → 2.5
        double d = 5 / 2;                       // 先に 2 になってから double に入る → 2.0
        System.out.println(d);
        System.out.println((double) 5 / 2);     // キャストが先 → 2.5
        System.out.println(-7 % 3);             // 余りの符号は左の数に従う → -1
        System.out.println(5.0 / 0);            // Infinity(例外にならない)
    }
}
// 出力: 2
// 出力: 2.5
// 出力: 2.0
// 出力: 2.5
// 出力: -1
// 出力: Infinity
```

- `int / 0` は実行時 `ArithmeticException`。`double / 0` は `Infinity`、`0.0 / 0` は `NaN`。
- `(double) a / b` は、`a` を先にキャストしてから割る。`(double)(a / b)` は割ってから変換するので別物。

### 数値プロモーション
`byte`・`short`・`char` は、計算の前に **int に引き上げ**られます。

```java
byte a = 10, b = 20;
// byte c = a + b;          // コンパイルエラー(結果は int)
byte c = (byte) (a + b);    // キャストすれば OK
// byte d = a + 1;          // これもコンパイルエラー(1 が int)
```

- 例外: `+=` などの**複合代入**は、自動で元の型にキャストされる。`byte x = 10; x += 5;` は OK。
- 定数同士なら、範囲内で OK: `byte e = 10 + 20;`(コンパイル時に 30 と決まるため)。
- オーバーフローは、エラーにならずに**ぐるっと回る**: `Integer.MAX_VALUE + 1` は最小値になる。

### インクリメント(++ / --)
| 書き方 | 意味 |
|---|---|
| `y = x++` | **まず代入、あとで +1**(後置) |
| `y = ++x` | **まず +1、それから代入**(前置) |

```java
public class Main {
    public static void main(String[] args) {
        int x = 10;
        int y = x++;        // y=10, x=11
        int z = ++x;        // x=12, z=12
        System.out.println(y + " " + x + " " + z);
        int i = 5;
        i = i++;            // i++ の値(5)が代入され直す → i は 5 のまま
        System.out.println(i);
        int n = 1;
        n += 2 * 3;         // n = n + (2*3)
        System.out.println(n);
    }
}
// 出力: 10 12 12
// 出力: 5
// 出力: 7
```

### 優先順位
`* / %` が `+ -` より先。同じ強さなら左から。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `double d = 5 / 2;` | **2.0**(2.5 ではない) |
| `byte c = a + b;`(byte 同士) | コンパイルエラー(結果は int) |
| `byte x += 5` | OK(複合代入は自動キャスト) |
| `-7 % 3` | -1(左の符号) |
| `i = i++;` | i は変わらない |
| `5.0 / 0` | Infinity |
| `5 / 0` | 実行時 ArithmeticException |
| `short s = 1; s = s + 1;` | コンパイルエラー |

## 確認ミニ問題

**Q1.** 出力は?
```java
int a = 7, b = 2;
double r = a / b;
System.out.println(r);
```
1. 3.5
2. 3
3. 3.0
4. コンパイルエラー

<details><summary>答え</summary>

**3**。`a / b` は int 同士で 3。それが double に変換されて `3.0`。

</details>

**Q2.** コンパイルが通るのは?

1. `byte a = 1, b = 2; byte c = a + b;`
2. `byte a = 1; byte b = a + 1;`
3. `byte a = 1; a += 1;`
4. `short s = 1; s = s + 1;`

<details><summary>答え</summary>

**3**。複合代入は自動で元の型にキャストされる。1・2・4 は int になるのでエラー。

</details>

**Q3.** 出力は?
```java
int x = 5;
int y = x++ + ++x;
System.out.println(x + " " + y);
```
1. `7 12`
2. `7 11`
3. `6 11`
4. `7 10`

<details><summary>答え</summary>

**1**。`x++` は 5(その後 x=6)、`++x` は 7(x=7)。`5 + 7 = 12`、x は 7。

</details>
