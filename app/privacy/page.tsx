const Page = () => {
  return (
    <div className="mt-16 mx-8 p-4 rounded bg-slate-100 text-slate-600">
      <h1 className="my-2 text-center text-2xl">プライバシーポリシー</h1>
      <p className="my-2">Newcheは、Googleによる認証において以下の情報を収集します:</p>
      <ul className="my-2 list-disc list-inside">
        <li>プロフィール情報</li>
        <li>メールアドレス</li>
      </ul>
      <p className="my-2">収集した情報は以下の目的で使用します:</p>
      <ul className="my-2 list-disc list-inside">
        <li>サービスの提供</li>
      </ul>
      <p className="my-2">ユーザーの情報は第三者に提供しません。</p>
      <p className="my-2">ユーザーの情報を保護するために適切なセキュリティー対策を講じます。</p>
      <p className="my-2">本ポリシーは予告なしに変更する場合があります。</p>
    </div>
  );
}

export default Page;
