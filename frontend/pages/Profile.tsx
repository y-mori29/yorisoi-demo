import React, { useState } from 'react';
import Disclaimer from '../components/Disclaimer';

const Profile: React.FC = () => {
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [condition, setCondition] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medication, setMedication] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ageGroup, gender, condition, treatment, medication });
    // TODO: バックエンドに送信する処理を追加
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <h1 className="text-xl font-bold mb-4">プロフィール入力</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">年代</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">選択してください</option>
              <option value="10代">10代</option>
              <option value="20代">20代</option>
              <option value="30代">30代</option>
              <option value="40代">40代</option>
              <option value="50代">50代</option>
              <option value="60代">60代</option>
              <option value="70代以上">70代以上</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">性別</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">選択してください</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">その他</option>
              <option value="回答しない">回答しない</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">疾患・病気・体調不調</label>
            <textarea
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="border p-2 w-full"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1">治療内容（治療中の場合）</label>
            <textarea
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="border p-2 w-full"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1">服薬歴</label>
            <textarea
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              className="border p-2 w-full"
              rows={3}
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
            送信
          </button>
        </form>
      </main>
      <footer>
        <Disclaimer />
      </footer>
    </div>
  );
};

export default Profile;
