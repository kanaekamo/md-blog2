import Footer from "../component/Footer";
import Header from "../component/Header";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";

export default async function Search({searchParams}: {searchParams: Promise<{keyword: string}>}) {
  //URLのクエリパラメータを取得
  const keyword = (await searchParams).keyword;

  //mdファイル情報を取得し、検索結果を抽出
    const postsDirectory = path.join(process.cwd(), '/src/app/posts');    //postディレクトリのパスを取得
    const fileNames = fs.readdirSync(postsDirectory);    //postディレクトリにあるファイル名を文字列として取得
    const posts = Promise.all(
      fileNames.map((fileName) => {
        const filePath = path.join(postsDirectory, fileName);    //ファイル名からmdファイルパスを取得
        const fileContents = fs.readFileSync(filePath, 'utf8');    //mdファイルの中身を取得
        const { data , content } = matter(fileContents);    //mdファイルの中身から本文を取得
        const contentText = content.toString();    //取得した本文を文字列型に変更
        return {
          slug: fileName.replace('.md', ''),    //各mdファイルへのリンク
          frontmatter: data,    //各mdファイルの---内のデータ
          text: contentText    //各mdファイルの本文
        };
      })
    );
    const results = (await posts).filter((post) => post.text.includes(`${keyword}`));    //本文に検索ワードを含むものだけをフィルター

  return(
    <div>
      <Header/>
      <main>
        <form className="flex justify-center my-[69px]">
          <input type="search" name="keyword" placeholder={keyword} className="text-black h-[36px] w-[358px] text-[20px] pl-2" />
          <button type="submit" formAction="/search" className="w-[62px] h-[37px] items-center text-white bg-[#444444] text-[16px] hover:bg-gray-400 active:bg-black">検索</button>
        </form>
        <p className="font-greatVibes text-[48px] text-center mb-[20px]">Search Results</p>
        <hr className="mx-auto border-[2px] border-white w-[960px] mb-[69px]" />
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
      </main>
      <Footer />
    </div>
  )
}