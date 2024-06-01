import Counter from "../_components/Counter";

export default async function Page() {
  const res = await fetch("http://hk-alb2-47b2d838154cd58f.elb.ap-south-1.amazonaws.com/guests");
  const data = await res.json();


  return (
    <div>
      <h1>Cabins page</h1>

      <ul>
        {data.result.map((user) => (
          <li key={user.id}>{user.fullName}</li>
        ))}
      </ul>

      <Counter users={data?.result ?? []} />
    </div>
  );
}
