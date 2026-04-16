import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { 
  Bold, Italic, Heading2, Heading3, List, ListOrdered, 
  Link as LinkIcon, Image as ImageIcon, Quote, Undo, Redo,
  Table as TableIcon, Trash2, Plus, Minus
} from 'lucide-react';

interface TiptapEditorProps {
  initialValue: string;
  onChange: (markdown: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Podaj adres URL (np. https://rpms.pl):');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Podaj adres URL obrazka (np. z Unsplash):');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
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
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('blockquote') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Cytat"
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded-[var(--radius-brand-input)] transition-colors text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        title="Linia pozioma"
      >
        <Minus size={18} />
      </button>
      <div className="w-px h-6 bg-slate-800 mx-1" />
      <button
        onClick={addLink}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('link') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Dodaj link"
      >
        <LinkIcon size={18} />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded-[var(--radius-brand-input)] transition-colors text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        title="Dodaj obrazek"
      >
        <ImageIcon size={18} />
      </button>
      <div className="w-px h-6 bg-slate-800 mx-1" />
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className={`p-2 rounded-[var(--radius-brand-input)] transition-colors ${editor.isActive('table') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        title="Wstaw tabelę"
      >
        <TableIcon size={18} />
      </button>
      
      {editor.isActive('table') && (
        <div className="flex items-center bg-slate-800/50 rounded-[var(--radius-brand-input)] p-1 ml-1">
          <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-1.5 text-slate-400 hover:text-white" title="Dodaj kolumnę"><Plus size={14} className="inline mr-1"/>Kol</button>
          <button onClick={() => editor.chain().focus().deleteColumn().run()} className="p-1.5 text-slate-400 hover:text-white" title="Usuń kolumnę"><Minus size={14} className="inline mr-1"/>Kol</button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button onClick={() => editor.chain().focus().addRowAfter().run()} className="p-1.5 text-slate-400 hover:text-white" title="Dodaj wiersz"><Plus size={14} className="inline mr-1"/>Wiersz</button>
          <button onClick={() => editor.chain().focus().deleteRow().run()} className="p-1.5 text-slate-400 hover:text-white" title="Usuń wiersz"><Minus size={14} className="inline mr-1"/>Wiersz</button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-1.5 text-red-400 hover:text-red-300" title="Usuń tabelę"><Trash2 size={14} /></button>
        </div>
      )}

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

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ initialValue, onChange }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-blue underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-[var(--radius-brand-button)] max-w-full h-auto my-4',
        },
      }),
      Markdown.configure({
        html: false, // Zapobiega zapisywaniu surowego HTML
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-700 bg-slate-800/50 p-2 font-bold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-700 p-2',
        },
      }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-slate max-w-none focus:outline-none min-h-[500px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      // KLUCZOWE: Pobieramy czysty Markdown, a nie obiekt JSON
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange(markdown);
    },
  });

  // Aktualizacja edytora, jeśli initialValue zmieni się z zewnątrz (np. przełączenie artykułu)
  useEffect(() => {
    if (editor && initialValue !== undefined) {
      const currentMarkdown = (editor.storage as any).markdown.getMarkdown();
      if (initialValue !== currentMarkdown) {
        // Używamy setTimeout, aby uniknąć problemów z cyklem renderowania Reacta
        setTimeout(() => {
          editor.commands.setContent(initialValue);
        });
      }
    }
  }, [initialValue, editor]);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-[var(--radius-brand-button)] border border-slate-800 overflow-hidden">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
