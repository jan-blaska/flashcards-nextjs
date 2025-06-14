import clsx from 'clsx';
import Link from 'next/link';
import { UrlObject } from 'url';

type Props = {
    text?: string;
    className?: string;
    href?: string | UrlObject;
    onClick?: () => void;
}

export default function Card({ text, className, href, onClick }: Props) {
    const cardClassName = clsx("p-2 md:p-4 text-center rounded-xl text-xl font-semibold bg-(--card) hover:opacity-70 dark:hover:opacity-80 flex justify-center items-center", className);

    if (href) {
        return (
            <Link href={href} className={clsx('cursor-pointer', cardClassName)}>
                <p className="text-lg md:text-2xl">{text}</p>
            </Link>
        )
    }

    if (onClick) {
        return (
            <button onClick={onClick} className={clsx('cursor-pointer', cardClassName)}>
                <p className="text-lg md:text-2xl">{text}</p>
            </button>
        )
    }

    return (
        <div className={cardClassName}>
            <p className="text-lg md:text-2xl">{text}</p>
        </div>
    );
};
