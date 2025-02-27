import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import path from "path";
import matter from "gray-matter";

export async function POST(req: NextRequest) {
  try{
    const commentData = await req.json();
    console.log("追加処理を行うコメントデータ:", commentData);

    const { commenter, comment, mainPath } = commentData;    //commentDataの中身

    const filePath = path.join(process.cwd(), '/src/app/posts', `${mainPath}.md`);    //mdファイルのパスを取得
    const fileContents = fs.readFileSync(filePath, 'utf8');    //mdファイルの中身を文字列として取得
    const { data , content } = matter(fileContents);    //mdファイルの---内を取得
    data.comments = [...data.comments , {commenter , comment}];    //---内のcommentsに送られてきたデータを追加
    const updatedContent = matter.stringify(content, data);   //データを追加した状態を定義
    await fs.promises.writeFile(filePath, updatedContent, 'utf8');    //ファイルを上書き
    console.log("追加完了");
    return NextResponse.json({ message: 'コメントが追加されました', success: true });

  } catch (error) {
    console.error("コメント追加エラー:", error);
    return NextResponse.json({ message: "コメント追加エラー", success: false });
  }
}