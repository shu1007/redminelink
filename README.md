# Redminelink

指定しておいたベースのテキストにファイルパス、リビジョン番号、選択中の行番号を入れて Redmine のリンクを作成します。

## 使い方

- settings.json に redminelink.baseText(string[])と追加しそこにベースのテキストを追加
- {FP}:ファイルパス, {RN}:リビジョン番号,　{LN}:行番号をテキストに挿入すると実行時にはそれらが挿入されます。

## settings.json 例

```JSON
"redmineLink.baseUrl": [
    "http://foo/bar/repository/revisions/{RN}/entry/{FP}#L{LN}",
    "source:\"{FP}@{RN}#L{LN}\""
]
```
