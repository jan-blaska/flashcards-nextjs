import clsx from 'clsx';
import Link from 'next/link';

type Props = {
    text?: string;
    className?: string;
    href?: string
    onClick?: () => void;
}

export default function Card({ text, className, href, onClick }: Props) {
    const cardComponent =
        <div className={clsx("rounded-xl text-xl font-semibold text-black bg-white flex justify-center items-center", className)}>
            <p className="text-lg">{text}</p>
        </div>

    if (href && href.length > 0) {
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
