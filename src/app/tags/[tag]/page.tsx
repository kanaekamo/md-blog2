import Footer from "@/app/component/Footer";
import Header from "@/app/component/Header";
import fs from "fs";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import path from "path";

export default async function TagsList({ params }: { params: Promise<{ tag: string }>}){
  const { tag } = await params;
  console.log(`選択したタグ：${tag}`)

  //mdファイル情報を取得し、検索結果を抽出
  const postsDirectory = path.join(process.cwd(), '/src/app/posts');    //postディレクトリのパスを取得
  const fileNames = fs.readdirSync(postsDirectory);    //postディレクトリにあるファイル名を文字列として取得
  const posts = Promise.all(
    fileNames.map((fileName) => {
      const filePath = path.join(postsDirectory, fileName);    //ファイル名からmdファイルパスを取得
      const fileContents = fs.readFileSync(filePath, 'utf8');    //mdファイルの中身を取得
      const { data } = matter(fileContents);    //mdファイルの中身から---内のデータを取得
      return {
        slug: fileName.replace('.md', ''),    //各mdファイルへのリンク
        frontmatter: data,    //各mdファイルの---内のデータ
      };
    })
  );
  const results = (await posts).filter((post) => post.frontmatter.tag.includes(`${tag}`));    //選択中のtagを含むものだけをフィルター
  
  //その他タグの表示
  const others = (await posts).flatMap((post) => {
    const tagdata: string = post.frontmatter.tag
    const tagLists = [...tagdata]    //タグのリストを作成
    return(
      tagLists.filter((tagList) => !tagList.includes(`${tag}`))    //選択中のtagを除く
    )
  });
  const otherLists = Array.from(new  Set(others));    //重複削除

  return(
    <div>
      <Header />
      <main>
        <p className="font-greatVibes text-[48px] text-center mt-[50px] mb-[20px]">Search Results by Tag</p>
        <hr className="mx-auto border-[2px] border-white w-[960px]" />
        <div className="flex justify-center my-[40px]">
          <p className="bg-[#444444] text-[24px] text-center rounded-[8px] px-7">{tag}</p>
        </div>
        <div className="mb-[110px] grid grid-cols-[361px_361px_361px] gap-[40px] justify-center">
        {(results).map((result) => (
          <Link key={result.slug} href={`/${result.slug}`}>
            <div className='w-[361px] h-[380px] rounded-[10px] border border-solid border-1'>
              <p className='text-[32px] text-center my-[10px]'>{result.frontmatter.title}</p>
              <div className='flex justify-center'>
                <Image
                  src={`/${result.frontmatter.image}`}
                  width={311}
                  height={179}
                  alt={result.frontmatter.title}
                />
              </div>
              <p className='text-[14px] m-[20px]'>{result.frontmatter.introduction}</p>
            </div>
          </Link>
        ))}
        </div>
        <p className="font-greatVibes text-[48px] text-center">Other Tags</p>
        <hr className="mx-auto border-[2px] border-white w-[960px]" />
        <div className="flex justify-center my-[40px] flex-wrap w-[960px] mx-auto">
          {(otherLists).map((otherList) => (
            <Link key={otherList} href={`/tags/${otherList}`}>
              <div className="bg-[#444444] mx-[20px] rounded-[8px]">
                <p className="text-[24px] text-center mx-7">{otherList}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}