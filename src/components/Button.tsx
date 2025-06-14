import clsx from 'clsx';

type ButtonColor = 'blue' | 'purple' | "red" | "green";

type Props = {
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    color?: ButtonColor;
    type?: 'button' | 'submit' | 'reset';
}

const ColorSet = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600',
}

export default function Button({ onClick, className, children, color, type }: Props) {
    const buttonColor = color ? ColorSet[color] : ColorSet.blue;

    return (
        <button
            className={clsx("py-4 w-full text-white rounded-xl cursor-pointer text-lg md:text-xl", className, buttonColor)}
            onClick={onClick}
            type={type || 'button'}
        >
            {children}
        </button>

    );
}