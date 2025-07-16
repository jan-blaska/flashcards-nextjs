import clsx from 'clsx';
import Link from 'next/link';
import { UrlObject } from 'url';
import { GrEdit } from "react-icons/gr";
import { BsTrash3 } from "react-icons/bs";

type Props = {
    text?: string;
    secondaryText?: string;
    className?: string;
    href?: string | UrlObject;
    onClick?: () => void;
    editButtonHref?: string | UrlObject;
    onDeleteButtonClick?: () => void;
    isCreateCard?: boolean;
}

export default function Card({ text, secondaryText, className, href, onClick, editButtonHref, onDeleteButtonClick, isCreateCard }: Props) {
    const cardClassName = clsx("rounded-xl flex justify-center items-stretch relative", className);
    const cardColorClassName = isCreateCard ? "bg-(--create-card)" : "bg-(--card)";
    const actionButtonClassName = "h-12 w-12 flex justify-center items-center rounded-full";

    const cardContent = (
        <div className='flex-1 w-full flex flex-col justify-evenly items-center rounded-xl p-4 text-center'>
            <p className="text-lg md:text-2xl">{text}</p>
            {secondaryText && <div className='h-[2px] bg-black opacity-20 dark:bg-white'/>}
            {secondaryText && <p className="text-sm md:text-lg">{secondaryText}</p>}
        </div>
    );

    const actionButtons = (
        <div className='absolute flex gap-2 z-10 right-3 top-3'>
            {editButtonHref && 
                <Link href={editButtonHref} className={clsx("bg-blue-500 hover:bg-blue-600", actionButtonClassName)}>
                    <GrEdit />
                </Link>}
            {onDeleteButtonClick &&
                <button 
                    onClick={onDeleteButtonClick}
                    className={clsx('bg-red-500 hover:bg-red-600 cursor-pointer', actionButtonClassName)}
                >
                    <BsTrash3 />
                </button>
            }
        </div>
    );
    
    if (href) {
        return (
            <div className={cardClassName}>
                {actionButtons}
                <Link href={href} className={clsx("flex w-full h-full justify-center items-center hover:opacity-70 dark:hover:opacity-80 rounded-xl", cardColorClassName)}>
                    {cardContent}
                </Link>
            </div>
        )
    }

    if (onClick) {
        return (
             <div className={cardClassName}>
                {actionButtons}
                <button onClick={onClick} className={clsx('w-full rounded-xl cursor-pointer', cardColorClassName)}>
                    {cardContent}
                </button>
            </div>
        )
    }

    return (
        <div className={cardClassName}>
            {actionButtons}
            <div className={clsx("w-full rounded-xl", cardColorClassName)}>
                {cardContent}
            </div>
        </div>
    );
};
