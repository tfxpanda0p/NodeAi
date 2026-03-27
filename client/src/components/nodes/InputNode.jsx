import { Handle, Position } from '@xyflow/react';

export default function InputNode({ data, isConnectable }) {
  const handleChange = (evt) => {
    if (data.onChange) {
      data.onChange(evt.target.value);
    }
  };

  return (
    <div className="bg-[var(--color-dark-charcoal)] border border-gray-700/40 shadow-2xl rounded-xl p-4 w-80 text-[var(--color-light-ash)] flex flex-col gap-2 transition-all hover:border-[var(--color-cyber-green)]/60 backdrop-blur-md">
      <div className="flex items-center justify-between mb-0.5 px-0.5">
        <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-[var(--color-medium-gray)] opacity-80">AI Prompt</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyber-green)] shadow-[0_0_8px_var(--color-cyber-green)] opacity-80"></div>
      </div>
      <textarea
        className="w-full h-12 p-3 bg-[var(--color-carbon-black)]/80 text-sm rounded-lg border border-gray-700/60 focus:border-[var(--color-cyber-green)]/50 focus:ring-1 focus:ring-[var(--color-cyber-green)]/20 outline-none resize-none placeholder-[var(--color-medium-gray)]/40 text-[var(--color-light-ash)] leading-tight shadow-inner"
        placeholder="Type a command..."
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (data.onRun) data.onRun();
          }
        }}
        value={data.value || ''}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-[var(--color-cyber-green)] !border-2 !border-[var(--color-dark-charcoal)]"
      />
    </div>
  );
}
