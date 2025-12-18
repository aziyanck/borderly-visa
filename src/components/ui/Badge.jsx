const statusConfig = {
    draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600' },
    passport_pending: { label: 'Passport Required', color: 'bg-amber-100 text-amber-700' },
    questions_pending: { label: 'Form Incomplete', color: 'bg-amber-100 text-amber-700' },
    payment_pending: { label: 'Payment Required', color: 'bg-orange-100 text-orange-700' },
    submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
    under_review: { label: 'Under Review', color: 'bg-purple-100 text-purple-700' },
    documents_pending: { label: 'Documents Pending', color: 'bg-amber-100 text-amber-700' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' }
}

const Badge = ({ status, className = '' }) => {
    const config = statusConfig[status] || statusConfig.draft

    return (
        <span className={`
      inline-flex items-center px-3 py-1 
      rounded-full text-xs font-semibold
      ${config.color}
      ${className}
    `}>
            {config.label}
        </span>
    )
}

export default Badge
