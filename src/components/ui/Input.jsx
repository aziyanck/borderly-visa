import { forwardRef } from 'react'

const Input = forwardRef(({
    label,
    error,
    className = '',
    type = 'text',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                    {props.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={`
          w-full px-4 py-3 
          bg-white border-2 border-slate-200 
          rounded-xl text-slate-900
          placeholder:text-slate-400
          focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
          transition-all duration-200
          disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
