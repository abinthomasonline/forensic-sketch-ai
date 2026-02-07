interface RunButtonProps {
  onClick: () => void
  disabled: boolean
  loading: boolean
}

export default function RunButton({ onClick, disabled, loading }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full px-6 py-4 text-lg font-semibold rounded-md transition ${
        disabled || loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {loading ? 'Processing...' : 'Run Reconstruction'}
    </button>
  )
}
