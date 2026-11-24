# 22 例外の種類・try-catch-finally

> ひとことで言うと: 「問題が起きたら投げる(throw)・受け止める(catch)」。`finally` は何があっても最後に動く。

読む目安: 10分 / 公式カテゴリ: 6 例外処理 / 弱点: finally+再スロー・checked の扱い

## 基本

### 例外の家系図
```
Throwable
├── Error(回復不能: OutOfMemoryError など)
└── Exception
    ├── RuntimeException(unchecked: catch も throws も任意)
    │     NullPointerException / ArithmeticException / ArrayIndexOutOfBoundsException
    │     ClassCastException / IllegalArgumentException / NumberFormatException
    └── それ以外(checked: catch か throws が必須)
          IOException / SQLException など
```

- 見分け方: **`RuntimeException` の子孫 → unchecked**。それ以外の `Exception` → **checked**。
- checked 例外を投げる可能性のある処理は、`try-catch` で受けるか、メソッドに **`throws`** を付けないと**コンパイルエラー**。
- `throw` は**投げる文**(`throw new Exception()`)、`throws` は**メソッドの宣言**(「投げるかも」)。

### try-catch-finally の基本
```java
public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("A");
            int x = 1 / 0;                       // ここで例外 → 以降の try 内は実行されない
            System.out.println("B");
        } catch (ArithmeticException e) {
            System.out.println("C");
        } finally {
            System.out.println("D");             // 必ず実行
        }
        System.out.println("E");
    }
}
// 出力: A
// 出力: C
// 出力: D
// 出力: E
```

- `catch` は**上から順に判定**。**親クラスを先に書く**と、子の `catch` に到達できず**コンパイルエラー**(子を先に書く)。
- `catch` なしの `try-finally` も有効。`try` は `catch` か `finally` のどちらかが必須。
- **`finally` は必ず実行される**(`return` があっても、例外が再スローされても。`System.exit()` を呼んだときだけ別)。
- **`finally` の中の `return` / `throw` は、`try` / `catch` のものを上書きする**。
- checked 例外を**投げる可能性が全くない** `try` に、その checked 例外の `catch` を書くと、コンパイルエラー(ただし `Exception` と `Throwable` は OK)。

### finally と再スロー(頻出)
```java
public class Main {
    static int f() {
        try {
            return 1;
        } finally {
            System.out.println("finally");     // return の前に実行される
        }
    }
    static int g() {
        try {
            return 1;
        } finally {
            return 2;                           // こちらが勝つ
        }
    }
    public static void main(String[] args) {
        System.out.println(f());
        System.out.println(g());
        try {
            try {
                System.out.println("A");
                throw new RuntimeException();
            } catch (RuntimeException e) {
                System.out.println("B");
                throw e;                        // 再スロー
            } finally {
                System.out.println("C");        // 再スローでも実行される
            }
        } catch (RuntimeException e) {
            System.out.println("D");
        }
    }
}
// 出力: finally
// 出力: 1
// 出力: 2
// 出力: A
// 出力: B
// 出力: C
// 出力: D
```

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| checked 例外を throws も catch もなしで | **コンパイルエラー**(実行時エラーではない) |
| `catch (Exception e)` の後に `catch (IOException e)` | コンパイルエラー(到達不能) |
| `try { } finally { }`(catch なし) | 有効 |
| `finally` 内の `return` | try の `return` を上書き |
| `finally` 内の `throw` | 元の例外を上書き |
| 例外が起きた行の「次の行」 | 実行されない |
| unchecked 例外に `throws` | 不要(書いても OK) |
| `Error` は catch すべき? | 通常しない(Exception の仲間ではない) |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?
```java
void m() {
    throw new java.io.IOException("x");
}
```
1. そのままで OK
2. `throws` も `try-catch` もないのでコンパイルエラー
3. 実行時に IOException が出る
4. 警告のみ

<details><summary>答え</summary>

**2**。checked 例外は処理か宣言が必須。

</details>

**Q2.** 出力は?
```java
try {
    System.out.print("A");
    throw new RuntimeException();
} catch (RuntimeException e) {
    System.out.print("B");
} finally {
    System.out.print("C");
}
System.out.print("D");
```
1. `ABD`
2. `ABCD`
3. `ACD`
4. `ABC`

<details><summary>答え</summary>

**2**。`A` → 例外 → `B` → `finally` の `C` → 続きの `D`。

</details>

**Q3.** 戻り値は?
```java
static int f() {
    try { return 1; }
    finally { return 3; }
}
```
1. 1
2. 3
3. 4
4. コンパイルエラー

<details><summary>答え</summary>

**2**。`finally` の `return` が `try` の `return` を上書きする。

</details>
