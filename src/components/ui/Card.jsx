const Card = ({ children, className = '', onClick, hoverable = false }) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white rounded-2xl border border-slate-200 
        shadow-sm
        ${hoverable ? 'hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    )
}

export default Card
