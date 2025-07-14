import clsx from 'clsx';

type ButtonColor = 'blue' | 'purple' | "red" | "green";

type Props = {
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    color?: ButtonColor;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const ColorSet = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600',
}

export default function Button({ onClick, className, children, color, type, disabled }: Props) {
    const buttonColor = color ? ColorSet[color] : ColorSet.blue;

    return (
        <button
            className={clsx("py-4 w-full text-white rounded-xl text-lg md:text-xl", className, disabled ? "bg-gray-500" : clsx(buttonColor, "cursor-pointer") )}
            onClick={onClick}
            type={type || 'button'}
            disabled={disabled}
        >
            {children}
        </button>

    );
}