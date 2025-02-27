import Header from "./component/Header";
import Footer from "./component/Footer";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";

//検索フォーム
function Form() {
  return (
    <form className="flex justify-center my-[69px]">
      <input type="search" name="keyword" placeholder="何をお探しだい？" className="text-black h-[36px] w-[358px] text-[20px] pl-2" />
      <button type="submit" formAction="/search" className="w-[62px] h-[37px] items-center text-white bg-[#444444] text-[16px] hover:bg-gray-400 active:bg-black">検索</button>
    </form>
  );
}

//ブログ一覧
async function List() {
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
  ).then((posts) =>
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())    //posts処理が成功した時に並び替え
  );
  return(
    <div className="mb-[110px] grid grid-cols-[361px_361px_361px] gap-[40px] justify-center">
      {(await posts).map((post) => (
        <Link key={post.slug} href={`/${post.slug}`}>
          <div className='w-[361px] h-[380px] rounded-[10px] border border-solid border-1'>
            <p className='text-[32px] text-center my-[10px]'>{post.frontmatter.title}</p>
            <div className='flex justify-center'>
              <Image
                src={`/${post.frontmatter.image}`}
                width={311}
                height={179}
                alt={post.frontmatter.title}
              />
            </div>
            <p className='text-[14px] m-[20px]'>{post.frontmatter.introduction}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Form />
        <p className="font-greatVibes text-[48px] text-center mb-[69px]">BlogList</p>
        <List />
      </main>
      <Footer />
    </div>
  );
}
