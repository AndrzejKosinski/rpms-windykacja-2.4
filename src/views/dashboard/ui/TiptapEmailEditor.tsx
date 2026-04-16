import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, Heading2, Heading3, List, ListOrdered, 
  Link as LinkIcon, Undo, Redo, ShieldAlert
} from 'lucide-react';

interface TiptapEmailEditorProps {
  initialValue: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Podaj adres URL (np. {{DASHBOARD_URL}}):');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addBlueBlock = () => {
    editor.chain().focus().insertContent(`
      <blockquote>
        <p><strong>Zgłoszone wierzytelności:</strong></p>
        <p>{{CASE_DETAILS}}</p>
      </blockquote>
      <p></p>
    `).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 rounded-t-[var(--radius-brand-button)]">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('bold') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Pogrubienie"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('italic') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Kursywa"
      >
        <Italic size={18} />
      </button>
      <div className="w-px h-6 bg-slate-800 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Nagłówek H2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Nagłówek H3"
      >
        <Heading3 size={18} />
      </button>
      <div className="w-px h-6 bg-slate-800 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('bulletList') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Lista punktowa"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('orderedList') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Lista numerowana"
      >
        <ListOrdered size={18} />
      </button>
      <div className="w-px h-6 bg-slate-800 mx-1" />
      <button
        onClick={addLink}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('link') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Dodaj link"
      >
        <LinkIcon size={18} />
      </button>
      <div className="w-px h-6 bg-slate-800 mx-1" />
      
      <button
        onClick={addBlueBlock}
        className="p-2 rounded-[var(--radius-brand-input)] transition-colors text-brand-blue hover:bg-brand-blue/20 bg-brand-blue/10 flex items-center gap-2 px-3"
        title="Wstaw niebieski blok wyróżniony"
      >
        <ShieldAlert size={18} />
        <span className="text-xs font-bold">Wyróżnienie</span>
      </button>

      <div className="flex-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded-[var(--radius-brand-input)] transition-colors text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Cofnij"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded-[var(--radius-brand-input)] transition-colors text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Ponów"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export const TiptapEmailEditor: React.FC<TiptapEmailEditorProps> = ({ initialValue, onChange }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color: #137fec; text-decoration: underline;',
        },
      }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-6',
        style: 'color: #64748b; font-size: 16px; line-height: 24px; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialValue !== undefined) {
      const currentHtml = editor.getHTML();
      if (initialValue !== currentHtml) {
        setTimeout(() => {
          editor.commands.setContent(initialValue);
        });
      }
    }
  }, [initialValue, editor]);

  return (
    <div className="flex flex-col h-full bg-white rounded-[var(--radius-brand-input)] border border-slate-700 overflow-hidden focus-within:border-brand-blue transition-colors">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto cursor-text bg-white text-slate-900" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
