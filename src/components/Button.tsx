import clsx from 'clsx';

type ButtonColor = 'blue' | 'purple';

type Props = {
    onClick: () => void;
    className?: string;
    children?: React.ReactNode;
    color?: ButtonColor;
}

const ColorSet = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600'
}

export default function Button({ onClick, className, children, color }: Props) {
    const buttonColor = color ? ColorSet[color] : ColorSet.blue;

    return (
        <button
            className={clsx("py-4 w-full text-white rounded-xl cursor-pointer ", className, buttonColor)}
            onClick={onClick}>{children}</button>
    );
}