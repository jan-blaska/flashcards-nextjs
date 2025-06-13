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
    const cardComponent =
        <div className={clsx("p-2 md:p-4 text-center rounded-xl text-xl font-semibold text-black bg-white flex justify-center items-center", className)}>
            <p className="text-lg md:text-2xl">{text}</p>
        </div>

    if (href) {
        return (
            <Link href={href} className={clsx(href ? 'cursor-pointer' : '')}>
                {cardComponent}
            </Link>
        )
    }

    if (onClick) {
        return (
            <div onClick={onClick} className={clsx('cursor-pointer', className)}>
                {cardComponent}
            </div>
        )
    }

    return cardComponent;
};
