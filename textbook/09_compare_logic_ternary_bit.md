# 09 比較・論理・三項演算子・ビット演算

> ひとことで言うと: `&&` は「左で決まったら右を見ない」。三項演算子は「**かっこで区切って**から」読む。

読む目安: 10分 / 公式カテゴリ: 3 演算子・制御構造 / 弱点: 三項演算子のネスト(最多ミス)・値交換・~

## 基本

### 比較と論理
- 比較: `==`、`!=`、`<`、`>`、`<=`、`>=`。結果は boolean。
- `==` は参照型では**同じオブジェクトか**の比較(値の比較は `equals`)。
- 優先順位: `!` → `&&` → `||`(`&&` の方が先)。`a || b && c` は `a || (b && c)`。

| 演算子 | 短絡評価 | 意味 |
|---|---|---|
| `&&` | する | 左が false なら右は**実行しない** |
| `\|\|` | する | 左が true なら右は**実行しない** |
| `&` | しない | 両側を**必ず評価**する |
| `\|` | しない | 両側を**必ず評価**する |
| `^` | しない | 排他的論理和(違うときだけ true) |

```java
public class Main {
    public static void main(String[] args) {
        int a = 0;
        boolean r1 = (a != 0) && (10 / a > 1);   // 左が false → 右を見ない(例外なし)
        System.out.println(r1);
        int n = 0;
        boolean r2 = (n > 0) && (++n > 0);        // 右は実行されない
        System.out.println(n);
        boolean r3 = (n > 0) & (++n > 0);          // & は右も実行する
        System.out.println(n);
        System.out.println(true ^ true);
    }
}
// 出力: false
// 出力: 0
// 出力: 1
// 出力: false
```

### 三項演算子(条件 ? A : B)
右側から結びつくので、ネストしたら**かっこを補って**読みます。

```java
public class Main {
    public static void main(String[] args) {
        int x = 15;
        // 読み方: x > 20 ? "A" : ( x > 10 ? "B" : "C" )
        String s = x > 20 ? "A" : x > 10 ? "B" : "C";
        System.out.println(s);
        System.out.println(true ? 1 : 2.0);      // 型がそろえられて 1.0
    }
}
// 出力: B
// 出力: 1.0
```

手順:
1. `?` と `:` の対応を見つけて、かっこを入れる。
2. 外側の条件から順に評価。選ばれなかった側は**評価しない**。
3. 2つの値の型が違うと、大きい型にそろえられる(`1` と `2.0` なら `1.0`)。

### ビット演算
| 演算 | 意味 | 例 |
|---|---|---|
| `&` | AND | `6 & 3` = 2 |
| `\|` | OR | `6 \| 3` = 7 |
| `^` | XOR | `6 ^ 3` = 5 |
| `~` | 反転 | `~a` = `-(a+1)`(`~5` は -6) |
| `<<` | 左シフト(×2ずつ) | `5 << 2` = 20 |
| `>>` | 右シフト(符号保持) | `-8 >> 1` = -4 |
| `>>>` | 右シフト(符号なし) | |

### 値の交換(a と b を入れ替える)
```java
public class Main {
    public static void main(String[] args) {
        int a = 10, b = 20;
        a ^= b; b ^= a; a ^= b;         // XOR スワップ
        System.out.println(a + " " + b);
        a = a + b; b = a - b; a = a - b; // 加減算スワップ(もう一度入れ替え)
        System.out.println(a + " " + b);
        int t = a; a = b; b = t;        // 一時変数スワップ(もう一度入れ替え)
        System.out.println(a + " " + b);
    }
}
// 出力: 20 10
// 出力: 10 20
// 出力: 20 10
```

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `false && (1/0 > 0)` | 例外にならず false(右を評価しない) |
| `false & (1/0 > 0)` | **ArithmeticException**(右も評価する) |
| `a \|\| b && c` | `a \|\| (b && c)` |
| `true ? 1 : 2.0` | 1.0 |
| `~5` | -6 |
| `if (x = 5)`(int の x) | コンパイルエラー(boolean ではない) |

## 確認ミニ問題

**Q1.** 出力は?
```java
int x = 5;
String s = x > 3 ? x > 4 ? "A" : "B" : "C";
System.out.println(s);
```
1. A
2. B
3. C
4. コンパイルエラー

<details><summary>答え</summary>

**1**。`x > 3 ? (x > 4 ? "A" : "B") : "C"`。`5 > 3` が true で、内側 `5 > 4` も true なので A。

</details>

**Q2.** 次のコードの結果は?
```java
int a = 0;
boolean b = (a > 0) & (10 / a > 1);
```
1. `b` は false
2. `b` は true
3. 実行時に ArithmeticException
4. コンパイルエラー

<details><summary>答え</summary>

**3**。`&` は短絡しないので右も評価され、0 で割って例外になる。`&&` なら false だった。

</details>

**Q3.** `System.out.println(~7);` の出力は?

1. 7
2. -7
3. -8
4. 8

<details><summary>答え</summary>

**3**。`~a = -(a+1)`。

</details>
