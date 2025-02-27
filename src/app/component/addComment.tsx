"use client"
import { useState } from "react";


type props = {
  pagePath: string,
}

export default function AddCommentForm({ pagePath }:props) {
  const [commenter, setCommenter] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  //コメンターが入力された時の動作
  const commenterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommenter(event.target.value);
  }

  //コメントが入力された時の動作
  const commentInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  }

  //コメント追加ボタンが押された時の動作
  const handleClick = async () => {
    try{
      const formData = {
        commenter,
        comment,
        mainPath: pagePath,
      };
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const addedComment = await response.json();
        console.log("追加に成功", addedComment)
        window.location.reload()
      }
    } catch (error) {
      console.error("コメント追加エラー", error);
    }
  };

  return(
    <form className="w-[1170px] mx-auto">
          <input type="text" id="commenter" value={commenter} onChange={commenterInput} placeholder="ニックネームを入力してください" className="block w-[470px] p-1 rounded-[6px] mb-[8px] text-black" />
          <textarea id="comment" value={comment} onChange={commentInput} placeholder="コメントを入力してください" className="block w-[1170px] h-[117px] rounded-[8px] text-black p-1" />
          <button type="button" onClick={handleClick} className="block bg-[#90003F] w-[265px] mx-auto p-1 rounded-[8px] text-[20px] mt-[15px]">コメントを追加</button>
        </form>
  )
}
