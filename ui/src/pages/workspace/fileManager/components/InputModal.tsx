// -Path: 'ui\src\pages\workspace\fileManager\components\InputModal.tsx'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileManagerStore } from '../../../../stores/fileManagerStore';

export default function InputModal() {
    const { modal, hideModal } = useFileManagerStore();
    const [values, setValues] = useState<Record<string, string>>({});

    useEffect(() => {
        if (modal.isOpen) {
            const initialValues: Record<string, string> = {};
            modal.fields.forEach((field) => {
                initialValues[field.key] = field.defaultValue || '';
            });
            setValues(initialValues);
        }
    }, [modal.isOpen, modal.fields]);

    if (!modal.isOpen) return null;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        modal.onSubmit(values);
        hideModal();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={hideModal}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl"
                >
                    <h3 className="mb-1 text-lg font-semibold text-surface-foreground">
                        {modal.title}
                    </h3>
                    {modal.description && (
                        <p className="mb-6 text-sm text-surface-foreground/60">
                            {modal.description}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {modal.fields.map((field) => (
                            <div key={field.key} className="space-y-1.5">
                                <label className="text-xs font-medium text-surface-foreground/60">
                                    {field.label}
                                </label>
                                <input
                                    autoFocus={
                                        modal.fields[0].key === field.key
                                    }
                                    type="text"
                                    value={values[field.key] || ''}
                                    placeholder={field.placeholder}
                                    onChange={(event) =>
                                        setValues({
                                            ...values,
                                            [field.key]: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>
                        ))}

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={hideModal}
                                className="rounded-md px-4 py-2 text-sm font-medium text-surface-foreground/60 hover:bg-surface-hover hover:text-surface-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-emphasis hover:shadow-primary/30 active:scale-[0.98]"
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
