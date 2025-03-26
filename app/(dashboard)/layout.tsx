import { Header } from "@/components/header";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <div className="px-3 lg:px-14">
          {children}
        </div>
      </Suspense>
    </>
  )
};

export default DashboardLayout;
