# 15 アクセス修飾子・カプセル化

> ひとことで言うと: 「誰に見せるか」の4段階(public → protected → なし → private)。外から勝手に触らせないのがカプセル化。

読む目安: 7分 / 公式カテゴリ: 4 クラス定義

## 基本

### アクセス修飾子の表
| 修飾子 | 同じクラス | 同じパッケージ | サブクラス(別パッケージ) | それ以外 |
|---|---|---|---|---|
| `public` | ○ | ○ | ○ | ○ |
| `protected` | ○ | ○ | ○(継承したものとして) | ✗ |
| (なし=パッケージプライベート) | ○ | ○ | ✗ | ✗ |
| `private` | ○ | ✗ | ✗ | ✗ |

- 上ほど広く公開、下ほど狭い。
- `protected` の別パッケージのサブクラスは、**自分の中で継承したメンバーとして使える**。親クラスのインスタンス経由で `親.protectedメンバー` を触るのは**不可**。
- トップレベルのクラスに付けられるのは `public` か、なし(パッケージプライベート)だけ。`private` クラスや `protected` クラスは(入れ子でない限り)コンパイルエラー。
- `public` クラスは、**ファイル名と同じ名前**でなければならない。
- ローカル変数には、アクセス修飾子を付けられない。

### カプセル化(外から直接触らせない)
フィールドを `private` にして、`public` な getter/setter 経由で操作させる。値のチェックを setter に入れられる。

```java
public class Main {
    static class Person {
        private String name;                       // 外から直接は触れない
        private int age;

        public String getName() { return name; }
        public void setAge(int age) {
            if (age >= 0) this.age = age;          // 不正な値は弾く
        }
        public int getAge() { return age; }
    }

    public static void main(String[] args) {
        Person p = new Person();
        p.setAge(-5);                              // 弾かれる
        System.out.println(p.getAge());
        p.setAge(20);
        System.out.println(p.getAge());
    }
}
// 出力: 0
// 出力: 20
```

### 不変(immutable)クラス
作った後は中身が変わらないクラス。

- フィールドは `private final`。
- setter を作らない。
- クラスを `final` にして、継承による書き換えも防ぐ。
- 可変なオブジェクト(配列や `ArrayList`)を持つなら、渡す・返すときは**コピー**を使う。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `private` なフィールドに別クラスからアクセス | コンパイルエラー |
| `private` メソッドをサブクラスで呼ぶ | コンパイルエラー(継承されたものとして使えない) |
| 修飾子なしのメンバーに別パッケージのサブクラスから | **アクセス不可** |
| `protected` を別パッケージの非継承クラスから | アクセス不可 |
| `public class A` を `B.java` に | コンパイルエラー |
| トップレベルの `private class` | コンパイルエラー |
| 同じクラスの別インスタンスの `private` | アクセス**できる**(クラス単位の制限) |

## 確認ミニ問題

**Q1.** 別パッケージのサブクラスから、親のメンバーに使えるのは?

1. `private` と `protected`
2. `protected` と `public`
3. 修飾子なし と `protected`
4. すべて

<details><summary>答え</summary>

**2**。`protected` と `public`。修飾子なしは同じパッケージのみ。

</details>

**Q2.** 不変クラスの条件として**不適切**なのは?

1. フィールドを `private final` にする
2. setter を作らない
3. クラスを `final` にする
4. フィールドを `public` にする

<details><summary>答え</summary>

**4**。`public` にすると外から書き換えられる。

</details>

**Q3.** コンパイルエラーになるのは?

1. `public class Main { }`(Main.java)
2. `class Helper { }`(Main.java の中の2つ目のクラス)
3. `private class Main { }`(トップレベル)
4. `public class Main { private int x; }`

<details><summary>答え</summary>

**3**。トップレベルのクラスに `private` は付けられない。

</details>
