import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive, Calendar, ChevronDown, Clock, FileText, Hash, History,
  LayoutDashboard, Navigation, Package, RefreshCw, ShoppingCart, Star,
  Truck, User, Warehouse, X, AlertTriangle, CheckCircle2, RotateCcw,
  Link as LinkIcon, Plus, Boxes, Ban, CircleDot
} from 'lucide-react';

const FORNECEDORES = ['Auto Peças Central', 'Distribuidora Norte', 'Peças & Cia', 'MotoPartes SP', 'Fornecedor Premium', 'Atacado Automotivo'];
const FILIAIS = ['Filial SP Centro', 'Filial SP Leste', 'Filial SP Sul', 'Filial Campinas', 'Filial Santo André'];
const FORNECEDORES_LOG = ['Uber Direct', 'Lalamove', '99Entrega', 'Loggi', 'Frete Próprio'];

const now = () => new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
const money = (v) => v == null || Number.isNaN(Number(v)) ? '—' : `R$\u00A0${Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const purchaseColumns = [
  { id: 'comprar', label: 'Pendente de Compra', bg: 'bg-gray-50', border: 'border-gray-200', title: 'text-gray-700', pill: 'bg-gray-100 text-gray-700' },
  { id: 'em_andamento', label: 'Em Andamento', bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-700', pill: 'bg-blue-100 text-blue-700' },
  { id: 'encomendado', label: 'Encomendado', bg: 'bg-purple-50', border: 'border-purple-200', title: 'text-purple-700', pill: 'bg-purple-100 text-purple-700' },
  { id: 'com_ocorrencia', label: 'Com Ocorrência', bg: 'bg-amber-50', border: 'border-amber-200', title: 'text-amber-700', pill: 'bg-amber-100 text-amber-700' },
  { id: 'furo_estoque', label: 'Furo com Cliente', bg: 'bg-orange-50', border: 'border-orange-200', title: 'text-orange-700', pill: 'bg-orange-100 text-orange-700' },
  { id: 'cancelado', label: 'Cancelados', bg: 'bg-red-50', border: 'border-red-200', title: 'text-red-700', pill: 'bg-red-100 text-red-700' },
  { id: 'finalizada', label: 'Finalizada', bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-700', pill: 'bg-green-100 text-green-700' },
];

const logisticsColumns = [
  { id: 'pending_items', label: 'Itens Pendentes', bg: 'bg-gray-50', border: 'border-gray-200', title: 'text-gray-700', pill: 'bg-gray-100 text-gray-700' },
  { id: 'scheduled', label: 'Logísticas Programadas', bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-700', pill: 'bg-blue-100 text-blue-700' },
  { id: 'in_progress', label: 'Logísticas em Andamento', bg: 'bg-purple-50', border: 'border-purple-200', title: 'text-purple-700', pill: 'bg-purple-100 text-purple-700' },
  { id: 'with_occurrence', label: 'Logísticas c/ Ocorrência', bg: 'bg-amber-50', border: 'border-amber-200', title: 'text-amber-700', pill: 'bg-amber-100 text-amber-700' },
  { id: 'completed', label: 'Logísticas Finalizadas', bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-700', pill: 'bg-green-100 text-green-700' },
];

const expeditionColumns = [
  { id: 'recebido', label: 'Recebido', bg: 'bg-gray-50', border: 'border-gray-200', title: 'text-gray-700', pill: 'bg-gray-100 text-gray-700' },
  { id: 'pronto_despacho', label: 'Pronto p/ Despacho', bg: 'bg-purple-50', border: 'border-purple-200', title: 'text-purple-700', pill: 'bg-purple-100 text-purple-700' },
  { id: 'despachado', label: 'Despachado', bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-700', pill: 'bg-green-100 text-green-700' },
];

const initialData = {
  purchaseItems: [
    { id: 'p1', plate: 'ABC-1234', vehicle: 'Toyota Corolla 2.0 Flex 2021', description: 'Pastilha de freio dianteira', orcId: 'ORC-4521', orcamentista: 'Carlos Mendes', mpi: 'MPI-8834', qty: 1, value: 380, cost: null, supplier: null, branch: null, address: null, providerOrderId: null, date: '10/04/2026', status: 'comprar', priority: false, archived: false, observation: null, hadSupplierStockout: false, supplierStockouts: [], history: [] },
    { id: 'p2', plate: 'DEF-5678', vehicle: 'Honda Civic 1.5 Turbo 2022', description: 'Filtro de óleo + filtro de ar', orcId: 'ORC-4522', orcamentista: 'Ana Paula', mpi: 'MPI-2201', qty: 2, value: 120, cost: null, supplier: 'Auto Peças Central', branch: null, address: null, providerOrderId: null, date: '11/04/2026', status: 'em_andamento', priority: false, archived: false, observation: null, hadSupplierStockout: false, supplierStockouts: [], history: [] },
    { id: 'p3', plate: 'GHI-9012', vehicle: 'Chevrolet Onix 1.0 Turbo 2023', description: 'Amortecedor traseiro (par)', orcId: 'ORC-4523', orcamentista: 'Roberto Lima', mpi: 'MPI-5543', qty: 2, value: 850, cost: null, supplier: 'Distribuidora Norte', branch: null, address: null, providerOrderId: null, date: '11/04/2026', status: 'encomendado', priority: true, archived: false, observation: null, hadSupplierStockout: false, supplierStockouts: [], history: [] },
    { id: 'p4', plate: 'JKL-3456', vehicle: 'Volkswagen Polo 1.0 2022', description: 'Kit embreagem completo', orcId: 'ORC-4524', orcamentista: 'Fernanda Costa', mpi: 'MPI-7721', qty: 1, value: 1200, cost: 980, supplier: 'Peças & Cia', branch: 'Filial SP Centro', address: 'Rua das Peças, 123', providerOrderId: 'PED-99887', date: '12/04/2026', status: 'finalizada', priority: false, archived: false, observation: null, hadSupplierStockout: false, supplierStockouts: [], history: [] },
  ],
  deliverables: [
    { id: 'l1', sourcePurchaseId: 'p4', logisticsContext: 'logistica', plate: 'JKL-3456', vehicle: 'Volkswagen Polo 1.0 2022', description: 'Kit embreagem completo', orcId: 'ORC-4524', orcamentista: 'Fernanda Costa', mpi: 'MPI-7721', qty: 1, value: 1200, supplier: 'Peças & Cia', address: 'Rua das Peças, 123', status: 'pending', priority: false, activeDeliveryId: null, archived: false, history: [] },
    { id: 'l2', sourcePurchaseId: 'p2', logisticsContext: 'ultima_milha', plate: 'DEF-5678', vehicle: 'Honda Civic 1.5 Turbo 2022', description: 'Filtro de óleo + filtro de ar', orcId: 'ORC-4522', orcamentista: 'Ana Paula', mpi: 'MPI-2201', qty: 2, value: 120, supplier: 'Auto Peças Central', address: 'AutoCenter Vila Nova, R. Brasil 250 — São Paulo/SP', status: 'pending', priority: true, activeDeliveryId: null, archived: false, history: [] },
  ],
  deliveries: [
    { id: 'del1', logisticsContext: 'logistica', status: 'in_progress', logisticsProvider: 'Lalamove', logisticsPrice: 35, trackingLink: 'https://lalamove.com/track/abc123', scheduledAt: '15/04/2026 10:00', departureAddress: 'Rua dos Sensores, 88 — São Paulo/SP', arrivalAddress: 'CD Mecanizou — São Paulo/SP', observations: null, archived: false, itemLinks: [
      { deliverableId: 'l3', status: 'active', occurrenceType: null, observation: null, legType: 'first_leg' }
    ], history: [] },
  ],
  expeditionItems: [
    { id: 'e1', plate: 'CDE-4422', vehicle: 'Hyundai Creta 1.6 2022', description: 'Bateria 60Ah', orcId: 'ORC-4530', orcamentista: 'Ana Paula', mpi: 'MPI-6612', qty: 1, value: 580, status: 'recebido', priority: false, archived: false, history: [] },
    { id: 'e2', plate: 'FGH-8811', vehicle: 'Volkswagen Saveiro 1.6 2021', description: 'Pneu 175/65 R14 (4un)', orcId: 'ORC-4531', orcamentista: 'Roberto Lima', mpi: 'MPI-7783', qty: 4, value: 1400, status: 'recebido', priority: true, archived: false, history: [] },
    { id: 'e3', plate: 'IJK-2266', vehicle: 'Fiat Mobi 1.0 2022', description: 'Limpador para-brisa (par)', orcId: 'ORC-4532', orcamentista: 'Fernanda Costa', mpi: 'MPI-9904', qty: 2, value: 60, status: 'pronto_despacho', priority: false, archived: false, history: [] },
  ]
};

initialData.deliverables.push({ id: 'lm-e3', sourceExpeditionId: 'e3', sourcePurchaseId: null, logisticsContext: 'ultima_milha', plate: 'IJK-2266', vehicle: 'Fiat Mobi 1.0 2022', description: 'Limpador para-brisa (par)', orcId: 'ORC-4532', orcamentista: 'Fernanda Costa', mpi: 'MPI-9904', qty: 2, value: 60, supplier: 'Expedição Mecanizou', address: 'CD Mecanizou — São Paulo/SP', status: 'pending', priority: false, activeDeliveryId: null, archived: false, history: [{ id: uid('h'), at: now(), property: 'context', from: 'Expedição - Pronto p/ Despacho', to: 'Última Milha - Itens Pendentes', trigger: 'Carga inicial' }] });

initialData.deliverables.push({ id: 'l3', sourcePurchaseId: 'p3', logisticsContext: 'logistica', plate: 'GHI-9012', vehicle: 'Chevrolet Onix 1.0 Turbo 2023', description: 'Amortecedor traseiro (par)', orcId: 'ORC-4523', orcamentista: 'Roberto Lima', mpi: 'MPI-5543', qty: 2, value: 850, supplier: 'Distribuidora Norte', address: 'Rua dos Sensores, 88 — São Paulo/SP', status: 'in_delivery', priority: true, activeDeliveryId: 'del1', archived: false, history: [] });

const cloneInitial = () => JSON.parse(JSON.stringify(initialData));

function addHistory(entity, property, from, to, trigger) {
  return {
    ...entity,
    history: [
      ...(entity.history || []),
      { id: uid('h'), at: now(), property, from: from ?? '—', to: to ?? '—', trigger }
    ]
  };
}

function Sidebar({ route, setRoute }) {
  const items = [
    { id: 'geral', label: 'Geral', icon: LayoutDashboard },
    { id: 'compras', label: 'Compras', icon: ShoppingCart },
    { id: 'logistica', label: 'Logística', icon: Truck },
    { id: 'expedicao', label: 'Expedição', icon: Warehouse },
    { id: 'ultima_milha', label: 'Última Milha', icon: Navigation },
  ];
  return <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
    <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-2">
      <div className="w-7 h-7 bg-blue-600 rounded-lg text-white text-xs font-bold flex items-center justify-center">M</div>
      <div><p className="text-sm font-bold text-gray-900">Mecanizou</p><p className="text-xs text-gray-400">Compras & Entrega</p></div>
    </div>
    <nav className="flex-1 px-2 py-3 space-y-1">
      {items.map(item => {
        const Icon = item.icon;
        const active = route === item.id;
        return <button key={item.id} onClick={() => setRoute(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Icon className="w-4 h-4" />{item.label}
        </button>;
      })}
    </nav>
    <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400">Protótipo v0.3</div>
  </aside>;
}

function Pill({ children, cls = 'bg-gray-100 text-gray-700' }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{children}</span>;
}

function ItemCard({ item, onClick, selectable, selected, onToggle, compact = false }) {
  const stockoutCount = item.supplierStockouts?.length || 0;
  return <div onClick={onClick} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.priority && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
          <span className="text-xs font-bold text-gray-900">{item.plate}</span>
          {stockoutCount > 0 && <Pill cls="bg-orange-100 text-orange-700">{stockoutCount} furo{stockoutCount > 1 ? 's' : ''}</Pill>}
        </div>
        <p className="text-xs text-gray-500 truncate">{item.vehicle}</p>
      </div>
      {selectable && <input type="checkbox" checked={selected} onChange={(e) => { e.stopPropagation(); onToggle?.(); }} onClick={(e) => e.stopPropagation()} className="w-4 h-4 rounded border-gray-300 text-blue-600" />}
    </div>
    <p className="text-xs text-gray-700 line-clamp-2 mt-2">{item.description}</p>
    {!compact && <div className="mt-2 space-y-1 text-xs text-gray-500">
      <p><span className="font-medium">ORC:</span> {item.orcId} · {item.orcamentista}</p>
      <p className="flex items-center gap-1"><Package className="w-3 h-3" /> Qtd: {item.qty} · {money(item.value)}</p>
      {item.supplier && <p className="truncate">Fornecedor: {item.supplier}</p>}
    </div>}
    {stockoutCount > 0 && <div className="mt-2 flex items-start gap-1 text-xs text-orange-700 bg-orange-50 rounded-md p-1.5">
      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <span className="line-clamp-2">Já furou em: {item.supplierStockouts.map(s => s.supplierName).join(', ')}</span>
    </div>}
  </div>;
}

function DeliveryCard({ delivery, items, onClick, onDragStart, onDragEnd, dragging }) {
  const activeItems = items.filter(i => delivery.itemLinks.some(l => l.deliverableId === i.id && l.status === 'active'));
  const hasPriority = activeItems.some(i => i.priority);
  const [open, setOpen] = useState(false);
  return <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onClick} className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all ${dragging ? 'opacity-40' : ''}`}>
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="flex items-center gap-1.5">
          {hasPriority && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
          <span className="text-xs font-bold text-gray-900">{delivery.id.toUpperCase()}</span>
          <Pill cls="bg-indigo-100 text-indigo-700">{activeItems.length} itens</Pill>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{delivery.logisticsProvider || 'Fornecedor logístico não informado'}</p>
      </div>
      <Truck className="w-4 h-4 text-gray-400" />
    </div>
    <div className="mt-2 space-y-1 text-xs text-gray-500">
      <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> {delivery.scheduledAt || 'Sem horário'}</p>
      <p>{money(delivery.logisticsPrice)} · {delivery.trackingLink ? 'com tracking' : 'sem tracking'}</p>
    </div>
    <button onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }} className="mt-2 w-full flex items-center justify-between text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md px-2 py-1">
      Ver itens carregados <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="mt-2 space-y-1">
      {activeItems.map(item => <div key={item.id} className="text-xs bg-gray-50 rounded-md px-2 py-1">
        <span className="font-medium text-gray-800">{item.plate}</span> · <span className="text-gray-500">{item.description}</span>
      </div>)}
    </div>}
  </div>;
}

function Column({ config, count, children, onDragOver, onDrop, dragOver }) {
  return <div onDragOver={onDragOver} onDrop={onDrop} className={`flex-shrink-0 w-72 rounded-xl border ${config.bg} ${config.border} flex flex-col transition-all ${dragOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
    <div className="px-3 py-2.5 border-b border-inherit flex items-center justify-between">
      <span className={`text-sm font-semibold ${config.title}`}>{config.label}</span>
      <span className="text-xs font-medium text-gray-400 bg-white rounded-full px-2 py-0.5 border border-gray-200">{count}</span>
    </div>
    <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[220px]">{children}</div>
  </div>;
}

function ModalShell({ title, subtitle, children, footer, onClose, max = 'max-w-2xl' }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
    <div className={`bg-white rounded-xl shadow-2xl ${max} w-full max-h-[90vh] overflow-y-auto`}>
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <div><h2 className="text-base font-bold text-gray-900">{title}</h2>{subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}</div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3 border-t border-gray-200 bg-white sticky bottom-0">{footer}</div>}
    </div>
  </div>;
}

function Field({ label, value, icon: Icon }) {
  return <div className="text-sm"><p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">{Icon && <Icon className="w-3 h-3" />}{label}</p><p className="text-gray-900">{value || <span className="text-gray-400 italic">—</span>}</p></div>;
}

function DetailItemModal({ item, context, onClose, onUpdate, onArchive }) {
  const [observation, setObservation] = useState(item.observation || '');
  const [priority, setPriority] = useState(Boolean(item.priority));
  const canArchive = ['finalizada', 'cancelado', 'furo_estoque', 'com_ocorrencia'].includes(item.status);
  const save = () => {
    let next = { ...item, observation: observation || null, priority };
    if (observation !== (item.observation || '')) next = addHistory(next, 'observation', item.observation || '—', observation || '—', 'Edição manual');
    if (priority !== item.priority) next = addHistory(next, 'priority', item.priority ? 'Sim' : 'Não', priority ? 'Sim' : 'Não', 'Edição manual');
    onUpdate(next);
    onClose();
  };
  return <ModalShell title={item.plate} subtitle={item.vehicle} onClose={onClose} footer={<div className="flex justify-between gap-2"><div>{canArchive && <button onClick={() => onArchive(item)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg inline-flex items-center gap-1"><Archive className="w-4 h-4" />Arquivar item</button>}</div><div className="flex gap-2"><button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Fechar</button><button onClick={save} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Salvar</button></div></div>}>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
        <Field label="Descrição" value={item.description} icon={Package} />
        <Field label="MPI" value={item.mpi} icon={Hash} />
        <Field label="Orçamento" value={item.orcId} icon={FileText} />
        <Field label="Orçamentista" value={item.orcamentista} icon={User} />
        <Field label="Qtd" value={item.qty} />
        <Field label="Valor" value={money(item.value)} />
        {item.supplier && <Field label="Fornecedor" value={item.supplier} />}
        {item.cost != null && <Field label="Custo" value={money(item.cost)} />}
      </div>
      {item.supplierStockouts?.length > 0 && <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <p className="text-xs font-semibold text-orange-700 uppercase mb-2">Fornecedores que apresentaram furo</p>
        <ul className="space-y-2">
          {item.supplierStockouts.map(s => <li key={s.id} className="text-xs text-orange-900"><b>{s.supplierName}</b> · {s.at}<br/><span className="text-orange-700">{s.observation}</span></li>)}
        </ul>
      </div>}
      <div className="space-y-3">
        <label className="block"><span className="block text-xs text-gray-600 mb-1">Observações</span><textarea value={observation} onChange={e => setObservation(e.target.value)} rows={3} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" /></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={priority} onChange={e => setPriority(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Marcar como prioridade</span><Star className={`w-3.5 h-3.5 ${priority ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} /></label>
      </div>
      <HistoryList history={item.history || []} />
    </div>
  </ModalShell>;
}

function HistoryList({ history }) {
  return <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs font-semibold text-gray-500 uppercase mb-2">Histórico ({history.length})</p>{history.length === 0 ? <p className="text-xs text-gray-400 italic">Nenhuma alteração registrada ainda.</p> : <ul className="space-y-2">{[...history].reverse().map(h => <li key={h.id} className="text-xs border-l-2 border-blue-200 pl-3 py-1"><p className="text-gray-500">{h.at} · {h.trigger}</p><p className="text-gray-700"><b>{h.property}</b>: <span className="text-gray-400 line-through">{h.from}</span> → <span className="text-gray-900">{h.to}</span></p></li>)}</ul>}</div>;
}

function FinalizePurchaseModal({ items, onClose, onConfirm }) {
  const [supplier, setSupplier] = useState(items[0]?.supplier || '');
  const [branch, setBranch] = useState('');
  const [address, setAddress] = useState('');
  const [providerOrderId, setProviderOrderId] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('multi_leg');
  const [rows, setRows] = useState(items.map(i => ({ id: i.id, qty: i.qty, cost: i.cost || '' })));
  const canConfirm = supplier && branch && address && providerOrderId && deliveryMode && rows.every(r => r.qty && r.cost);
  const updateRow = (id, field, value) => setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  return <ModalShell title="Registrar compra finalizada" subtitle={`${items.length} item(ns). A compra permanece em Compras - Finalizada e cria item pendente na logística.`} onClose={onClose} max="max-w-3xl" footer={<div className="flex justify-end gap-2"><button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button><button disabled={!canConfirm} onClick={() => onConfirm({ supplier, branch, address, providerOrderId, deliveryMode, rows })} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40">Confirmar</button></div>}>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label><span className="block text-xs text-gray-600 mb-1">Fornecedor *</span><select value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5 bg-white"><option value="">Selecione...</option>{FORNECEDORES.map(f => <option key={f} value={f}>{f}</option>)}</select></label>
        <label><span className="block text-xs text-gray-600 mb-1">Filial *</span><select value={branch} onChange={e => setBranch(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5 bg-white"><option value="">Selecione...</option>{FILIAIS.map(f => <option key={f} value={f}>{f}</option>)}</select></label>
        <label className="col-span-2"><span className="block text-xs text-gray-600 mb-1">Endereço *</span><input value={address} onChange={e => setAddress(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label>
        <label><span className="block text-xs text-gray-600 mb-1">ID Pedido Fornecedor *</span><input value={providerOrderId} onChange={e => setProviderOrderId(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label>
        <label><span className="block text-xs text-gray-600 mb-1">Fluxo de entrega *</span><select value={deliveryMode} onChange={e => setDeliveryMode(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5 bg-white"><option value="multi_leg">Multi-leg / Cross até expedição</option><option value="direct">Direct / Última milha</option></select></label>
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-200"><table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs"><tr><th className="px-3 py-2 text-left">Item</th><th className="px-3 py-2 w-24 text-left">Qtd *</th><th className="px-3 py-2 w-32 text-left">Custo *</th></tr></thead><tbody className="divide-y divide-gray-100">{rows.map(row => { const item = items.find(i => i.id === row.id); return <tr key={row.id}><td className="px-3 py-2"><p className="text-xs font-medium text-gray-900">{item.plate}</p><p className="text-xs text-gray-500">{item.description}</p></td><td className="px-3 py-2"><input type="number" min="1" value={row.qty} onChange={e => updateRow(row.id, 'qty', e.target.value)} className="w-full text-sm rounded border border-gray-300 px-2 py-1" /></td><td className="px-3 py-2"><input type="number" min="0" step="0.01" value={row.cost} onChange={e => updateRow(row.id, 'cost', e.target.value)} className="w-full text-sm rounded border border-gray-300 px-2 py-1" /></td></tr>; })}</tbody></table></div>
    </div>
  </ModalShell>;
}

function CreateDeliveryModal({ items, context, onClose, onConfirm }) {
  const [provider, setProvider] = useState('');
  const [price, setPrice] = useState('');
  const [tracking, setTracking] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [departure, setDeparture] = useState(items[0]?.address || '');
  const [arrival, setArrival] = useState(context === 'logistica' ? 'CD Mecanizou — São Paulo/SP' : 'Cliente / Oficina de destino');
  const [status, setStatus] = useState('scheduled');
  const canConfirm = provider && price && scheduledAt && departure && arrival;
  return <ModalShell title="Criar logística" subtitle={`${items.length} item(ns) selecionados. A partir daqui, o card será de logística.`} onClose={onClose} max="max-w-xl" footer={<div className="flex justify-end gap-2"><button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button><button disabled={!canConfirm} onClick={() => onConfirm({ provider, price: parseFloat(price), tracking, scheduledAt, departure, arrival, status })} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40">Criar logística</button></div>}>
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label><span className="block text-xs text-gray-600 mb-1">Fornecedor logístico *</span><select value={provider} onChange={e => setProvider(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5 bg-white"><option value="">Selecione...</option>{FORNECEDORES_LOG.map(f => <option key={f} value={f}>{f}</option>)}</select></label>
        <label><span className="block text-xs text-gray-600 mb-1">Status inicial *</span><select value={status} onChange={e => setStatus(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5 bg-white"><option value="scheduled">Programada</option><option value="in_progress">Em andamento</option></select></label>
        <label><span className="block text-xs text-gray-600 mb-1">Custo do frete *</span><input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label>
        <label><span className="block text-xs text-gray-600 mb-1">Data/hora *</span><input value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} placeholder="dd/mm/yyyy hh:mm" className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label>
        <label className="col-span-2"><span className="block text-xs text-gray-600 mb-1">Origem *</span><input value={departure} onChange={e => setDeparture(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label>
        <label className="col-span-2"><span className="block text-xs text-gray-600 mb-1">Destino *</span><input value={arrival} onChange={e => setArrival(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label>
        <label className="col-span-2"><span className="block text-xs text-gray-600 mb-1">Tracking</span><input value={tracking} onChange={e => setTracking(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label>
      </div>
      <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs font-semibold text-gray-500 uppercase mb-2">Itens</p><div className="space-y-1">{items.map(i => <p key={i.id} className="text-xs text-gray-700"><b>{i.plate}</b> · {i.description}</p>)}</div></div>
    </div>
  </ModalShell>;
}

function DeliveryModal({ delivery, items, purchaseItems, onClose, onUpdateStatus, onCancelDelivery, onSupplierStockout, onCancelItem, onArchive }) {
  const activeItems = items.filter(i => delivery.itemLinks.some(l => l.deliverableId === i.id && l.status === 'active'));
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [stockoutItem, setStockoutItem] = useState(null);
  const [stockoutObservation, setStockoutObservation] = useState('');
  const [stockoutSupplier, setStockoutSupplier] = useState('');
  const [cancelItem, setCancelItem] = useState(null);
  const [cancelItemObservation, setCancelItemObservation] = useState('');
  const canArchive = delivery.status === 'completed' || delivery.status === 'with_occurrence' || delivery.status === 'canceled';

  const registerStockout = () => {
    if (!stockoutItem || !stockoutObservation.trim() || !stockoutSupplier.trim()) return;
    onSupplierStockout(delivery, stockoutItem, stockoutSupplier, stockoutObservation);
    setStockoutItem(null); setStockoutObservation(''); setStockoutSupplier('');
  };

  const registerCancelItem = () => {
    if (!cancelItem || !cancelItemObservation.trim()) return;
    onCancelItem(delivery, cancelItem, cancelItemObservation);
    setCancelItem(null); setCancelItemObservation('');
  };

  return <ModalShell title={`Logística ${delivery.id.toUpperCase()}`} subtitle={`${activeItems.length} item(ns) ativos`} onClose={onClose} max="max-w-4xl" footer={<div className="flex justify-between gap-2"><div className="flex gap-2">{canArchive && <button onClick={() => onArchive(delivery)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg inline-flex items-center gap-1"><Archive className="w-4 h-4" />Arquivar logística</button>}<button onClick={() => setCancelConfirm(true)} className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center gap-1"><Ban className="w-4 h-4" />Cancelar logística</button></div><div className="flex gap-2"><button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Fechar</button>{delivery.status !== 'completed' && <button onClick={() => onUpdateStatus(delivery, 'completed')} className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Finalizar logística</button>}</div></div>}>
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3">
        <Field label="Fornecedor logístico" value={delivery.logisticsProvider} icon={Truck} />
        <Field label="Custo" value={money(delivery.logisticsPrice)} />
        <Field label="Programada para" value={delivery.scheduledAt} icon={Clock} />
        <Field label="Origem" value={delivery.departureAddress} />
        <Field label="Destino" value={delivery.arrivalAddress} />
        <Field label="Tracking" value={delivery.trackingLink ? <a className="text-blue-600 hover:underline inline-flex items-center gap-1" href={delivery.trackingLink} target="_blank" rel="noreferrer"><LinkIcon className="w-3 h-3" />Abrir</a> : '—'} />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Itens carregados</p>
        <div className="rounded-lg border border-gray-200 overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-3 py-2 text-left">Item</th><th className="px-3 py-2 text-left">Compra original</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-right">Ações</th></tr></thead><tbody className="divide-y divide-gray-100">{activeItems.map(item => { const purchase = purchaseItems.find(p => p.id === item.sourcePurchaseId); return <tr key={item.id}><td className="px-3 py-2"><p className="font-medium text-gray-900 flex items-center gap-1">{item.priority && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}{item.plate}</p><p className="text-xs text-gray-500">{item.description}</p></td><td className="px-3 py-2 text-gray-600 text-xs">{purchase?.providerOrderId || purchase?.orcId || '—'}<br/>{purchase?.supplier || item.supplier || '—'}</td><td className="px-3 py-2"><Pill cls="bg-green-100 text-green-700">Ativo na logística</Pill></td><td className="px-3 py-2 text-right"><div className="flex justify-end gap-1 flex-wrap"><button onClick={() => { setStockoutItem(item); setStockoutSupplier(purchase?.supplier || item.supplier || ''); }} className="px-2 py-1 text-xs text-orange-700 hover:bg-orange-50 rounded-md inline-flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Furo fornecedor</button><button onClick={() => setCancelItem(item)} className="px-2 py-1 text-xs text-red-700 hover:bg-red-50 rounded-md inline-flex items-center gap-1"><Ban className="w-3.5 h-3.5" />Cancelar item</button></div></td></tr>; })}</tbody></table>{activeItems.length === 0 && <div className="text-center text-sm text-gray-400 py-8">Nenhum item ativo nessa logística.</div>}</div>
      </div>

      <HistoryList history={delivery.history || []} />
    </div>

    {cancelConfirm && <ModalShell title="Cancelar logística?" subtitle="Todos os itens ativos voltam para Pendentes." onClose={() => setCancelConfirm(false)} max="max-w-md" footer={<div className="flex justify-end gap-2"><button onClick={() => setCancelConfirm(false)} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Voltar</button><button onClick={() => { onCancelDelivery(delivery); setCancelConfirm(false); onClose(); }} className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">Cancelar logística</button></div>}><p className="text-sm text-gray-600">Essa ação não apaga histórico. Ela cancela a logística e devolve os itens para a coluna de pendentes.</p></ModalShell>}

    {stockoutItem && <ModalShell title="Registrar furo do fornecedor" subtitle={`${stockoutItem.plate} · ${stockoutItem.description}`} onClose={() => setStockoutItem(null)} max="max-w-lg" footer={<div className="flex justify-end gap-2"><button onClick={() => setStockoutItem(null)} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button><button disabled={!stockoutObservation.trim() || !stockoutSupplier.trim()} onClick={registerStockout} className="px-4 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-40">Confirmar furo</button></div>}>
      <div className="space-y-3"><label><span className="block text-xs text-gray-600 mb-1">Fornecedor que furou *</span><input value={stockoutSupplier} onChange={e => setStockoutSupplier(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-1.5" /></label><label><span className="block text-xs text-gray-600 mb-1">Observação obrigatória *</span><textarea value={stockoutObservation} onChange={e => setStockoutObservation(e.target.value)} rows={4} placeholder="Explique o que aconteceu na retirada..." className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 resize-none" /></label><div className="bg-orange-50 text-orange-800 text-xs rounded-lg p-3">O item voltará para Compras - Pendente de Compra, com prioridade marcada e registro do fornecedor que apresentou furo.</div></div>
    </ModalShell>}

    {cancelItem && <ModalShell title="Cancelar item da logística" subtitle={`${cancelItem.plate} · ${cancelItem.description}`} onClose={() => setCancelItem(null)} max="max-w-lg" footer={<div className="flex justify-end gap-2"><button onClick={() => setCancelItem(null)} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Voltar</button><button disabled={!cancelItemObservation.trim()} onClick={registerCancelItem} className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-40">Confirmar cancelamento</button></div>}>
      <div className="space-y-3"><label><span className="block text-xs text-gray-600 mb-1">Observação obrigatória *</span><textarea value={cancelItemObservation} onChange={e => setCancelItemObservation(e.target.value)} rows={4} placeholder="Explique por que esse item foi cancelado..." className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 resize-none" /></label><div className="bg-red-50 text-red-800 text-xs rounded-lg p-3">O item será removido da logística e lançado para Compras - Cancelados.</div></div>
    </ModalShell>}
  </ModalShell>;
}

function ConfirmArchiveModal({ label, onClose, onConfirm }) {
  return <ModalShell title="Arquivar item?" subtitle="Ele vai sumir da tela, mas o histórico continua existindo nos dados do protótipo." onClose={onClose} max="max-w-md" footer={<div className="flex justify-end gap-2"><button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button><button onClick={onConfirm} className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">Arquivar</button></div>}><p className="text-sm text-gray-600">Confirmar arquivamento de <b>{label}</b>?</p></ModalShell>;
}

function PurchasePage({ data, setData }) {
  const [dragged, setDragged] = useState(null);
  const [detail, setDetail] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [finalizeItems, setFinalizeItems] = useState(null);

  const visible = data.purchaseItems.filter(i => !i.archived);
  const grouped = useMemo(() => {
    const g = Object.fromEntries(purchaseColumns.map(c => [c.id, []]));
    visible.forEach(i => g[i.status]?.push(i));
    Object.keys(g).forEach(k => g[k].sort((a, b) => Number(b.priority) - Number(a.priority) || a.plate.localeCompare(b.plate)));
    return g;
  }, [visible]);

  const applyStatus = (item, status) => {
    if (item.status === status) return;
    if (status === 'finalizada') { setFinalizeItems([item]); return; }
    setData(prev => ({ ...prev, purchaseItems: prev.purchaseItems.map(i => i.id === item.id ? addHistory({ ...i, status }, 'status', i.status, status, 'Mudança manual') : i) }));
  };
  const finalize = (payload) => {
    const targetContext = payload.deliveryMode === 'direct' ? 'ultima_milha' : 'logistica';
    setData(prev => {
      const selectedIds = new Set(finalizeItems.map(i => i.id));
      const nextPurchase = prev.purchaseItems.map(i => {
        if (!selectedIds.has(i.id)) return i;
        const row = payload.rows.find(r => r.id === i.id);
        let updated = { ...i, status: 'finalizada', supplier: payload.supplier, branch: payload.branch, address: payload.address, providerOrderId: payload.providerOrderId, qty: parseInt(row.qty, 10), cost: parseFloat(row.cost) };
        updated = addHistory(updated, 'status', i.status, 'finalizada', `Registro de compra — ${payload.deliveryMode}`);
        return updated;
      });
      const newDeliverables = finalizeItems.map((i, idx) => {
        const row = payload.rows.find(r => r.id === i.id);
        return {
          id: uid('logitem'), sourcePurchaseId: i.id, logisticsContext: targetContext,
          plate: i.plate, vehicle: i.vehicle, description: i.description, orcId: i.orcId, orcamentista: i.orcamentista,
          mpi: i.mpi, qty: parseInt(row.qty, 10), value: i.value, supplier: payload.supplier, address: payload.address,
          status: 'pending', priority: i.priority, activeDeliveryId: null, archived: false,
          history: [{ id: uid('h'), at: now(), property: 'context', from: 'Compras', to: targetContext === 'logistica' ? 'Logística 1ª perna' : 'Última Milha', trigger: 'Compra finalizada' }]
        };
      });
      return { ...prev, purchaseItems: nextPurchase, deliverables: [...prev.deliverables, ...newDeliverables] };
    });
    setFinalizeItems(null);
  };

  return <div className="flex flex-col h-full gap-4">
    <Header title="Compras" subtitle={`${visible.length} itens ativos`} />
    <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
      {purchaseColumns.map(col => <Column key={col.id} config={col} count={grouped[col.id]?.length || 0} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (dragged) applyStatus(dragged, col.id); setDragged(null); }}>
        {(grouped[col.id] || []).map(item => <div key={item.id} draggable onDragStart={() => setDragged(item)} onDragEnd={() => setDragged(null)}><ItemCard item={item} onClick={() => setDetail(item)} /></div>)}
        {(grouped[col.id] || []).length === 0 && <Empty />}
      </Column>)}
    </div>
    {detail && <DetailItemModal item={detail} context="compras" onClose={() => setDetail(null)} onUpdate={(next) => setData(prev => ({ ...prev, purchaseItems: prev.purchaseItems.map(i => i.id === next.id ? next : i) }))} onArchive={(item) => { setArchiveTarget({ type: 'purchase', item }); setDetail(null); }} />}
    {archiveTarget && <ConfirmArchiveModal label={archiveTarget.item.plate || archiveTarget.item.id} onClose={() => setArchiveTarget(null)} onConfirm={() => { setData(prev => ({ ...prev, purchaseItems: prev.purchaseItems.map(i => i.id === archiveTarget.item.id ? addHistory({ ...i, archived: true }, 'archived', 'Não', 'Sim', 'Arquivamento manual') : i) })); setArchiveTarget(null); }} />}
    {finalizeItems && <FinalizePurchaseModal items={finalizeItems} onClose={() => setFinalizeItems(null)} onConfirm={finalize} />}
  </div>;
}

function LogisticsPage({ context, data, setData }) {
  const [selected, setSelected] = useState(new Set());
  const [createFor, setCreateFor] = useState(null);
  const [draggedDelivery, setDraggedDelivery] = useState(null);
  const [deliveryDetail, setDeliveryDetail] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);

  const items = data.deliverables.filter(i => i.logisticsContext === context && !i.archived);
  const pending = items.filter(i => i.status === 'pending' && !i.activeDeliveryId).sort((a, b) => Number(b.priority) - Number(a.priority) || a.plate.localeCompare(b.plate));
  const deliveries = data.deliveries.filter(d => d.logisticsContext === context && !d.archived && d.status !== 'canceled');
  const byStatus = Object.fromEntries(logisticsColumns.filter(c => c.id !== 'pending_items').map(c => [c.id, []]));
  deliveries.forEach(d => byStatus[d.status]?.push(d));
  const selectedItems = pending.filter(i => selected.has(i.id));

  const createDelivery = (payload) => {
    const id = uid('del');
    setData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(i => selected.has(i.id) ? addHistory({ ...i, status: 'in_delivery', activeDeliveryId: id }, 'status', 'pending', 'in_delivery', 'Logística criada') : i),
      deliveries: [...prev.deliveries, {
        id, logisticsContext: context, status: payload.status, logisticsProvider: payload.provider, logisticsPrice: payload.price,
        trackingLink: payload.tracking || null, scheduledAt: payload.scheduledAt, departureAddress: payload.departure, arrivalAddress: payload.arrival,
        observations: null, archived: false,
        itemLinks: selectedItems.map(i => ({ deliverableId: i.id, status: 'active', occurrenceType: null, observation: null, legType: context === 'logistica' ? 'first_leg' : 'last_mile' })),
        history: [{ id: uid('h'), at: now(), property: 'status', from: '—', to: payload.status, trigger: 'Criação de logística' }]
      }]
    }));
    setSelected(new Set());
    setCreateFor(null);
  };

  const updateDeliveryStatus = (delivery, status) => {
    setData(prev => {
      const activeLinks = delivery.itemLinks.filter(l => l.status === 'active');
      const activeIds = new Set(activeLinks.map(l => l.deliverableId));
      const deliveryNext = prev.deliveries.map(d => d.id === delivery.id ? addHistory({ ...d, status }, 'status', d.status, status, 'Mudança manual') : d);

      let nextDeliverables = prev.deliverables;
      let nextExpeditionItems = prev.expeditionItems;

      if (status === 'completed') {
        nextDeliverables = prev.deliverables.map(i => activeIds.has(i.id)
          ? addHistory({ ...i, status: 'completed', archived: context === 'logistica' ? true : i.archived }, 'status', i.status, 'completed', 'Logística finalizada')
          : i
        );

        if (context === 'logistica') {
          const existingSources = new Set(prev.expeditionItems.map(e => e.sourceDeliverableId).filter(Boolean));
          const created = prev.deliverables
            .filter(i => activeIds.has(i.id) && !existingSources.has(i.id))
            .map(i => ({
              id: uid('exp'), sourceDeliverableId: i.id, sourcePurchaseId: i.sourcePurchaseId,
              plate: i.plate, vehicle: i.vehicle, description: i.description, orcId: i.orcId,
              orcamentista: i.orcamentista, mpi: i.mpi, qty: i.qty, value: i.value,
              status: 'recebido', priority: i.priority, archived: false,
              history: [{ id: uid('h'), at: now(), property: 'context', from: 'Logística 1ª perna', to: 'Expedição - Recebido', trigger: 'Logística finalizada' }]
            }));
          nextExpeditionItems = [...prev.expeditionItems, ...created];
        }
      }

      return { ...prev, deliveries: deliveryNext, deliverables: nextDeliverables, expeditionItems: nextExpeditionItems };
    });
    setDeliveryDetail(prev => prev?.id === delivery.id ? { ...prev, status } : prev);
  };

  const cancelDelivery = (delivery) => {
    const activeIds = new Set(delivery.itemLinks.filter(l => l.status === 'active').map(l => l.deliverableId));
    setData(prev => ({
      ...prev,
      deliveries: prev.deliveries.map(d => d.id === delivery.id ? addHistory({ ...d, status: 'canceled', itemLinks: d.itemLinks.map(l => l.status === 'active' ? { ...l, status: 'canceled' } : l) }, 'status', d.status, 'canceled', 'Cancelamento operacional') : d),
      deliverables: prev.deliverables.map(i => activeIds.has(i.id) ? addHistory({ ...i, status: 'pending', activeDeliveryId: null }, 'status', i.status, 'pending', 'Logística cancelada') : i)
    }));
  };

  const supplierStockout = (delivery, item, supplierName, observation) => {
    const sourceId = item.sourcePurchaseId;
    setData(prev => ({
      ...prev,
      deliveries: prev.deliveries.map(d => d.id === delivery.id ? addHistory({ ...d, status: d.status === 'completed' ? d.status : 'with_occurrence', itemLinks: d.itemLinks.map(l => l.deliverableId === item.id ? { ...l, status: 'failed', occurrenceType: 'supplier_stockout', observation } : l) }, 'occurrence', '—', 'supplier_stockout', `Furo de fornecedor — ${item.plate}`) : d),
      deliverables: prev.deliverables.map(i => i.id === item.id ? addHistory({ ...i, status: 'failed_supplier_stockout', activeDeliveryId: null, archived: true }, 'status', i.status, 'failed_supplier_stockout', 'Furo de fornecedor') : i),
      purchaseItems: prev.purchaseItems.map(p => {
        if (p.id !== sourceId) return p;
        const meta = { id: uid('stockout'), supplierName, deliveryId: delivery.id, at: now(), observation };
        let next = { ...p, status: 'comprar', priority: true, archived: false, hadSupplierStockout: true, supplierStockouts: [...(p.supplierStockouts || []), meta], observation: observation || p.observation };
        next = addHistory(next, 'status', p.status, 'comprar', `Furo de fornecedor em ${supplierName}`);
        next = addHistory(next, 'priority', p.priority ? 'Sim' : 'Não', 'Sim', 'Retorno automático para compra');
        return next;
      })
    }));
  };


  const cancelDeliveryItem = (delivery, item, observation) => {
    const sourceId = item.sourcePurchaseId;
    setData(prev => ({
      ...prev,
      deliveries: prev.deliveries.map(d => d.id === delivery.id ? addHistory({ ...d, status: d.status === 'completed' ? d.status : 'with_occurrence', itemLinks: d.itemLinks.map(l => l.deliverableId === item.id ? { ...l, status: 'canceled', occurrenceType: 'item_canceled', observation } : l) }, 'occurrence', '—', 'item_canceled', `Item cancelado — ${item.plate}`) : d),
      deliverables: prev.deliverables.map(i => i.id === item.id ? addHistory({ ...i, status: 'item_canceled', activeDeliveryId: null, archived: true }, 'status', i.status, 'item_canceled', 'Cancelamento individual na logística') : i),
      purchaseItems: prev.purchaseItems.map(p => {
        if (p.id !== sourceId) return p;
        let next = { ...p, status: 'cancelado', archived: false, observation: observation || p.observation };
        next = addHistory(next, 'status', p.status, 'cancelado', 'Cancelamento individual na logística');
        next = addHistory(next, 'observation', p.observation || '—', observation, 'Cancelamento individual na logística');
        return next;
      })
    }));
  };

  return <div className="flex flex-col h-full gap-4">
    <div className="flex items-center justify-between gap-3 flex-wrap"><Header title={context === 'logistica' ? 'Logística 1ª Perna' : 'Última Milha'} subtitle="Pendentes são itens; depois da criação, os cards são logísticas." inline />{selectedItems.length > 0 && <button onClick={() => setCreateFor(selectedItems)} className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 inline-flex items-center gap-1"><Plus className="w-4 h-4" />Criar logística ({selectedItems.length})</button>}</div>
    <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
      <Column config={logisticsColumns[0]} count={pending.length}>
        {pending.map(item => <ItemCard key={item.id} item={item} selectable selected={selected.has(item.id)} onToggle={() => setSelected(prev => { const next = new Set(prev); next.has(item.id) ? next.delete(item.id) : next.add(item.id); return next; })} onClick={() => setSelected(prev => { const next = new Set(prev); next.has(item.id) ? next.delete(item.id) : next.add(item.id); return next; })} />)}
        {pending.length === 0 && <Empty />}
      </Column>
      {logisticsColumns.slice(1).map(col => <Column key={col.id} config={col} count={byStatus[col.id]?.length || 0} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (draggedDelivery) updateDeliveryStatus(draggedDelivery, col.id); setDraggedDelivery(null); }}>
        {(byStatus[col.id] || []).map(delivery => <DeliveryCard key={delivery.id} delivery={delivery} items={items} onClick={() => setDeliveryDetail(delivery)} onDragStart={() => setDraggedDelivery(delivery)} onDragEnd={() => setDraggedDelivery(null)} dragging={draggedDelivery?.id === delivery.id} />)}
        {(byStatus[col.id] || []).length === 0 && <Empty />}
      </Column>)}
    </div>
    {createFor && <CreateDeliveryModal items={createFor} context={context} onClose={() => setCreateFor(null)} onConfirm={createDelivery} />}
    {deliveryDetail && <DeliveryModal delivery={data.deliveries.find(d => d.id === deliveryDetail.id) || deliveryDetail} items={data.deliverables.filter(i => i.logisticsContext === context)} purchaseItems={data.purchaseItems} onClose={() => setDeliveryDetail(null)} onUpdateStatus={updateDeliveryStatus} onCancelDelivery={cancelDelivery} onSupplierStockout={supplierStockout} onCancelItem={cancelDeliveryItem} onArchive={(delivery) => { setArchiveTarget(delivery); setDeliveryDetail(null); }} />}
    {archiveTarget && <ConfirmArchiveModal label={archiveTarget.id.toUpperCase()} onClose={() => setArchiveTarget(null)} onConfirm={() => { setData(prev => ({ ...prev, deliveries: prev.deliveries.map(d => d.id === archiveTarget.id ? addHistory({ ...d, archived: true }, 'archived', 'Não', 'Sim', 'Arquivamento manual') : d) })); setArchiveTarget(null); }} />}
  </div>;
}

function ExpeditionPage({ data, setData }) {
  const [dragged, setDragged] = useState(null);
  const grouped = Object.fromEntries(expeditionColumns.map(c => [c.id, []]));
  data.expeditionItems.filter(i => !i.archived).forEach(i => grouped[i.status]?.push(i));
  Object.keys(grouped).forEach(k => grouped[k].sort((a, b) => Number(b.priority) - Number(a.priority) || a.plate.localeCompare(b.plate)));
  const [detail, setDetail] = useState(null);

  const ensureLastMileDeliverable = (expeditionItem, items) => {
    if (items.some(i => i.sourceExpeditionId === expeditionItem.id && i.logisticsContext === 'ultima_milha' && !i.archived)) return [];
    return [{
      id: uid('lastmile'), sourceExpeditionId: expeditionItem.id, sourcePurchaseId: expeditionItem.sourcePurchaseId,
      logisticsContext: 'ultima_milha', plate: expeditionItem.plate, vehicle: expeditionItem.vehicle,
      description: expeditionItem.description, orcId: expeditionItem.orcId, orcamentista: expeditionItem.orcamentista,
      mpi: expeditionItem.mpi, qty: expeditionItem.qty, value: expeditionItem.value,
      supplier: 'Expedição Mecanizou', address: 'CD Mecanizou — São Paulo/SP', status: 'pending',
      priority: expeditionItem.priority, activeDeliveryId: null, archived: false,
      history: [{ id: uid('h'), at: now(), property: 'context', from: 'Expedição - Pronto p/ Despacho', to: 'Última Milha - Itens Pendentes', trigger: 'Item pronto para despacho' }]
    }];
  };

  const moveItem = (item, status) => {
    if (item.status === status) return;
    setData(prev => {
      const updatedExpedition = prev.expeditionItems.map(i => i.id === item.id ? addHistory({ ...i, status }, 'status', i.status, status, 'Mudança manual') : i);
      const extraDeliverables = status === 'pronto_despacho' ? ensureLastMileDeliverable(item, prev.deliverables) : [];
      return { ...prev, expeditionItems: updatedExpedition, deliverables: [...prev.deliverables, ...extraDeliverables] };
    });
  };

  return <div className="flex flex-col h-full gap-4"><Header title="Expedição" subtitle="Itens recebidos da primeira perna. Pronto p/ despacho também aparece na Última Milha." /><div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">{expeditionColumns.map(col => <Column key={col.id} config={col} count={grouped[col.id]?.length || 0} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (dragged) moveItem(dragged, col.id); setDragged(null); }}>{(grouped[col.id] || []).map(item => <div key={item.id} draggable onDragStart={() => setDragged(item)} onDragEnd={() => setDragged(null)}><ItemCard item={item} onClick={() => setDetail(item)} /></div>)}{(grouped[col.id] || []).length === 0 && <Empty />}</Column>)}</div>{detail && <DetailItemModal item={detail} context="expedicao" onClose={() => setDetail(null)} onUpdate={(next) => setData(prev => ({ ...prev, expeditionItems: prev.expeditionItems.map(i => i.id === next.id ? next : i) }))} onArchive={() => {}} />}</div>;
}

function GeralPage({ data, setRoute }) {
  const groups = [
    { id: 'compras', label: 'Compras', cls: 'bg-blue-50 border-blue-200 text-blue-700', items: data.purchaseItems.filter(i => !i.archived), render: (item) => <ItemCard key={item.id} item={item} compact /> },
    { id: 'logistica', label: 'Logística 1ª Perna', cls: 'bg-purple-50 border-purple-200 text-purple-700', items: [
      ...data.deliverables.filter(i => i.logisticsContext === 'logistica' && !i.archived && i.status === 'pending'),
      ...data.deliveries.filter(d => d.logisticsContext === 'logistica' && !d.archived && d.status !== 'canceled').map(d => ({ ...d, __kind: 'delivery' }))
    ], render: (item) => item.__kind === 'delivery' ? <GeneralDeliveryCard key={item.id} delivery={item} items={data.deliverables} /> : <ItemCard key={item.id} item={item} compact /> },
    { id: 'expedicao', label: 'Expedição', cls: 'bg-orange-50 border-orange-200 text-orange-700', items: data.expeditionItems.filter(i => !i.archived), render: (item) => <ItemCard key={item.id} item={item} compact /> },
    { id: 'ultima_milha', label: 'Última Milha', cls: 'bg-green-50 border-green-200 text-green-700', items: [
      ...data.deliverables.filter(i => i.logisticsContext === 'ultima_milha' && !i.archived && i.status === 'pending'),
      ...data.deliveries.filter(d => d.logisticsContext === 'ultima_milha' && !d.archived && d.status !== 'canceled').map(d => ({ ...d, __kind: 'delivery' }))
    ], render: (item) => item.__kind === 'delivery' ? <GeneralDeliveryCard key={item.id} delivery={item} items={data.deliverables} /> : <ItemCard key={item.id} item={item} compact /> },
  ];

  return <div className="flex flex-col h-full gap-4">
    <Header title="Acompanhamento Geral" subtitle="Lista geral das frentes operacionais" />
    <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
      {groups.map(group => <div key={group.id} className={`flex-shrink-0 w-72 rounded-xl border ${group.cls} flex flex-col`}>
        <button onClick={() => setRoute(group.id)} className="w-full px-3 py-2.5 border-b border-inherit text-left hover:brightness-95 transition-all">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold">{group.label}</span><span className="text-xs font-medium rounded-full px-2 py-0.5 border border-inherit bg-white text-gray-700">{group.items.length}</span></div>
          <p className="text-xs text-gray-500 mt-0.5">Clique para abrir →</p>
        </button>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {group.items.map(group.render)}
          {group.items.length === 0 && <Empty />}
        </div>
      </div>)}
    </div>
  </div>;
}

function GeneralDeliveryCard({ delivery, items }) {
  const activeItems = items.filter(i => delivery.itemLinks?.some(l => l.deliverableId === i.id && l.status === 'active'));
  return <div className="w-full text-left bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm">
    <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-gray-900">{delivery.id.toUpperCase()}</span><Pill cls="bg-indigo-100 text-indigo-700">Logística</Pill></div>
    <p className="text-xs text-gray-600 truncate mt-1">{delivery.logisticsProvider || 'Sem fornecedor'} · {activeItems.length} item(ns)</p>
    <p className="text-xs text-gray-400 truncate mt-0.5">{delivery.scheduledAt || 'Sem horário'} · {delivery.status}</p>
  </div>;
}

function Header({ title, subtitle, inline = false }) {
  return <div><h1 className="text-xl font-bold text-gray-900">{title}</h1>{subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}</div>;
}
function Empty() { return <div className="flex items-center justify-center h-28 text-xs text-gray-400">Nenhum item</div>; }

export default function App() {
  const [route, setRoute] = useState('geral');
  const [data, setData] = useState(() => {
    try { const saved = localStorage.getItem('mecanizou-prototipo-v4'); return saved ? JSON.parse(saved) : cloneInitial(); } catch { return cloneInitial(); }
  });
  useEffect(() => { try { localStorage.setItem('mecanizou-prototipo-v4', JSON.stringify(data)); } catch {} }, [data]);
  const reset = () => { localStorage.removeItem('mecanizou-prototipo-v4'); setData(cloneInitial()); };

  return <div className="h-screen bg-gray-100 flex overflow-hidden text-gray-900"><Sidebar route={route} setRoute={setRoute} /><main className="flex-1 min-w-0 flex flex-col"><div className="flex justify-end px-6 py-3 border-b border-gray-200 bg-white"><button onClick={reset} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Resetar dados"><RefreshCw className="w-4 h-4" /></button></div><div className="flex-1 min-h-0 p-6 overflow-hidden">{route === 'geral' && <GeralPage data={data} setRoute={setRoute} />}{route === 'compras' && <PurchasePage data={data} setData={setData} />}{route === 'logistica' && <LogisticsPage context="logistica" data={data} setData={setData} />}{route === 'ultima_milha' && <LogisticsPage context="ultima_milha" data={data} setData={setData} />}{route === 'expedicao' && <ExpeditionPage data={data} setData={setData} />}</div></main></div>;
}
