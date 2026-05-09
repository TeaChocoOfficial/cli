// -Path: 'test\react-app\src\Documents\Report.tsx'
import { useEffect, useState } from "react";

export default function Report() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(count + 1);
    }, []);

    return <div>{count}</div>;
}
