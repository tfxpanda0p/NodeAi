import { Handle, Position } from '@xyflow/react';
import { Bot, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ResultNode({ data, isConnectable }) {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isLoading = data.isLoading;
  const error = data.error;

  const [prevResponse, setPrevResponse] = useState(data.response);
  if (data.response !== prevResponse) {
    setSaved(false);
    setPrevResponse(data.response);
  }

  const handleSave = async () => {
    if (data.onSave && !saved && !isSaving) {
      setIsSaving(true);
      const success = await data.onSave();
      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
      setIsSaving(false);
    }
  };

  return (
    <div className={`bg-[var(--color-dark-charcoal)] border shadow-2xl rounded-2xl p-5 w-[32rem] text-[var(--color-light-ash)] flex flex-col gap-3 transition-all ${error ? 'border-red-500/50' : 'border-gray-700/50 hover:border-[var(--color-cyber-green)]/40'}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-gray-600 !border-2 !border-[var(--color-dark-charcoal)]"
      />
      
      <div className="font-semibold text-sm flex items-center justify-between border-b border-gray-700/50 pb-3">
        <div className="flex items-center gap-2">
          {error ? (
            <AlertCircle size={18} className="text-red-500" />
          ) : (
            <Bot size={18} className="text-[var(--color-cyber-green)]" />
          )}
          <span className={error ? 'text-red-400' : 'text-xs uppercase tracking-widest text-[var(--color-medium-gray)]'}>
            {error ? 'Error' : 'AI Response'}
          </span>
        </div>

        {data.response && !error && !isLoading && (
          <button 
            onClick={handleSave}
            disabled={saved || isSaving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
              ${saved 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 cursor-default' 
                : 'bg-[var(--color-carbon-black)] border-gray-700 text-gray-400 hover:text-[var(--color-cyber-green)] hover:border-[var(--color-cyber-green)]/50'
              }`}
          >
            {saved ? (
              <><CheckCircle2 size={14} /> Saved</>
            ) : isSaving ? (
              'Saving...'
            ) : (
              <><Save size={14} /> Save to History</>
            )}
          </button>
        )}
      </div>
      
      <div className="mt-1 min-h-[6rem] text-sm whitespace-pre-wrap leading-relaxed">
        {isLoading ? (
          <div className="flex items-center gap-3 text-[var(--color-medium-gray)] italic py-4">
            <span className="animate-bounce w-2 h-2 rounded-full bg-[var(--color-cyber-green)] block"></span>
            <span className="animate-bounce w-2 h-2 rounded-full bg-[var(--color-cyber-green)] block" style={{ animationDelay: '0.2s' }}></span>
            <span className="animate-bounce w-2 h-2 rounded-full bg-[var(--color-cyber-green)] block" style={{ animationDelay: '0.4s' }}></span>
          </div>
        ) : error ? (
            <span className="text-red-400 block py-2">{error}</span>
        ) : (
          data.response || <span className="text-[var(--color-medium-gray)] italic">AI thoughts will appear here...</span>
        )}
      </div>
    </div>
  );
}
