import Link from "next/link";

export default function Header() {
  return (
    <div className="h-[129px] bg-[#90003F]">
      <header className="text-white text-[64px] font-greatVibes pt-[25px] pl-[29px]">
        <Link href="/">KamoBlog</Link>
      </header>
    </div>
  )
}