import fs from "fs";
import matter from "gray-matter";
import path from "path";
import Header from "../component/Header";
import Image from "next/image";
import remarkHtml from 'remark-html';
import { remark } from "remark";
import './content.css';
import Link from "next/link";
import { Key } from "react";
import AddCommentForm from "../component/addComment";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }>}) {
  //mdファイル情報を取得し、htmlに変換
  const { slug } = await params;
  const filePath = path.join(process.cwd(), '/src/app/posts', `${slug}.md`);    //mdファイルのパスを取得
  const fileContents = fs.readFileSync(filePath, 'utf8');    //mdファイルの中身を文字列として取得
  const { data, content } = matter(fileContents);    //mdファイルの---内(data)と本文(content)を取得
  const processedContent = await remark().use(remarkHtml).process(content);    //md本文(content)をmd→mdast(remark)→html(remarkHtml)に変換
  const contentHtml = processedContent.toString();    //htmlに変換された元mdを文字列型に変換
  const title = data.title;
  const saunier = data.image;
  const tags = data.tag;
  const comments = data.comments;

  const pagePath = `/${slug}`    //コメント追加時に使用

  return (
    <div className="bg-[#444444] min-h-screen pb-[70px]">
      <Header />
      <main>
        <div className="text-[48px] font-bold my-[59px] text-center">{title}</div>
        <div className="flex justify-center">
          <Image
            src={`/${saunier}`}
            width={622}
            height={358}
            alt={title}
          />
        </div>
        <div className="mt-[50px] text-center w-[960px] mx-auto">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
        </div>
        <div className="mt-[50px]">
          <hr className="mx-auto border-[3px] border-[#90003F] w-[960px]" />
          <p className="text-[48px] font-greatVibes my-[30px]">Tags</p>
          <div className="flex justify-center mb-[80px] flex-wrap w-[960px] mx-auto">
            {(tags).map((tag: Key) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <div className="bg-[#90003F] mx-[20px] rounded-[8px]">
                  <p className="text-[24px] text-center mx-7">{tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <hr className="mx-auto border-[3px] border-[#90003F] w-[960px]" />
          <p className="text-[48px] font-greatVibes my-[30px]">Comment</p>
          {(comments).map((comment: {commenter: string , comment: string}) => (
            <div className="w-[1170px] mx-auto rounded-[8px] border-[5px] border-[#90003F] mb-[30px] p-[20px]">
              <p className="text-left text-[20px] mb-[10px]">{comment.commenter}さんからのコメント</p>
              <p className="text-left text-[20px]">{comment.comment}</p>
            </div>
          ))}
        </div>
        <AddCommentForm pagePath={pagePath} />
      </main>
    </div>
  );
}