"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Database,
  FileText,
  ShoppingBag,
  Truck,
  Building2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { InvoicesTable } from "@/components/erp/invoices-table";
import { PurchaseOrdersTable } from "@/components/erp/purchase-orders-table";
import { GRNTable } from "@/components/erp/grn-table";
import { VendorsTable } from "@/components/erp/vendors-table";
import { LineItemsModal } from "@/components/erp/line-items-modal";
import {
  listInvoices,
  listPurchaseOrders,
  listGRNs,
  listVendors,
} from "@/lib/api/endpoints";
import { Invoice, PurchaseOrder, GoodsReceiptNote, Vendor } from "@/lib/schemas/erp";
import { InvoiceLine, POLine, GRNLine } from "@/components/erp/line-items-modal";
import { formatCurrency } from "@/lib/utils";

type ErpTab = "invoices" | "pos" | "grns" | "vendors";

type ModalState =
  | { type: "INVOICE"; title: string; subtitle: string; lines: InvoiceLine[]; totalAmount?: number; currency?: string }
  | { type: "PO"; title: string; subtitle: string; lines: POLine[]; totalAmount?: number; currency?: string }
  | { type: "GRN"; title: string; subtitle: string; lines: GRNLine[] }
  | null;

function ErpExplorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get("tab") || "invoices").toLowerCase() as ErpTab;
  const initialTab: ErpTab = ["invoices", "pos", "grns", "vendors"].includes(tabParam)
    ? tabParam
    : "invoices";

  const [activeTab, setActiveTab] = useState<ErpTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [modalData, setModalData] = useState<ModalState>(null);

  // Sync state if query params change externally
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
    const t = searchParams.get("tab") as ErpTab | null;
    if (t && ["invoices", "pos", "grns", "vendors"].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  // Handle Tab Switch
  const handleTabChange = (newTab: ErpTab, newQuery?: string) => {
    setActiveTab(newTab);
    const updatedQuery = newQuery !== undefined ? newQuery : "";
    setSearchQuery(updatedQuery);

    const params = new URLSearchParams();
    params.set("tab", newTab);
    if (updatedQuery) {
      params.set("q", updatedQuery);
    }
    router.replace(`/erp?${params.toString()}`);
  };

  // React Queries for all 4 tables
  const {
    data: invoices = [],
    isLoading: loadingInvoices,
    refetch: refetchInvoices,
    isFetching: fetchingInvoices,
  } = useQuery({
    queryKey: ["erp", "invoices"],
    queryFn: () => listInvoices(),
  });

  const {
    data: purchaseOrders = [],
    isLoading: loadingPOs,
    refetch: refetchPOs,
    isFetching: fetchingPOs,
  } = useQuery({
    queryKey: ["erp", "purchase-orders"],
    queryFn: () => listPurchaseOrders(),
  });

  const {
    data: grns = [],
    isLoading: loadingGRNs,
    refetch: refetchGRNs,
    isFetching: fetchingGRNs,
  } = useQuery({
    queryKey: ["erp", "grns"],
    queryFn: () => listGRNs(),
  });

  const {
    data: vendors = [],
    isLoading: loadingVendors,
    refetch: refetchVendors,
    isFetching: fetchingVendors,
  } = useQuery({
    queryKey: ["erp", "vendors"],
    queryFn: () => listVendors(),
  });

  const isAnyFetching = fetchingInvoices || fetchingPOs || fetchingGRNs || fetchingVendors;

  const handleRefreshAll = () => {
    refetchInvoices();
    refetchPOs();
    refetchGRNs();
    refetchVendors();
  };

  // Cross-Link Navigators
  const navigateToPO = (poId: string) => {
    handleTabChange("pos", poId);
  };

  const navigateToVendor = (vendorId: string) => {
    handleTabChange("vendors", vendorId);
  };

  const navigateToInvoicesForPO = (poId: string) => {
    handleTabChange("invoices", poId);
  };

  const navigateToGRNsForPO = (poId: string) => {
    handleTabChange("grns", poId);
  };

  const navigateToInvoicesForVendor = (vendorId: string) => {
    handleTabChange("invoices", vendorId);
  };

  const navigateToPOsForVendor = (vendorId: string) => {
    handleTabChange("pos", vendorId);
  };

  // Inspect Handlers
  const handleInspectInvoice = (invoice: Invoice) => {
    setModalData({
      type: "INVOICE",
      title: invoice.invoice_id,
      subtitle: `Vendor: ${invoice.vendor_id} • PO Ref: ${invoice.po_id}`,
      lines: invoice.lines,
      totalAmount: invoice.total_amount,
      currency: invoice.currency,
    });
  };

  const handleInspectPO = (po: PurchaseOrder) => {
    setModalData({
      type: "PO",
      title: po.po_id,
      subtitle: `Vendor: ${po.vendor_id} • Created: ${po.created_date}`,
      lines: po.lines,
      totalAmount: po.total_amount,
      currency: po.currency,
    });
  };

  const handleInspectGRN = (grn: GoodsReceiptNote) => {
    setModalData({
      type: "GRN",
      title: grn.grn_id,
      subtitle: `PO Ref: ${grn.po_id} • Received: ${grn.received_date}`,
      lines: grn.lines,
    });
  };

  // Financial summary calculations
  const totalInvoicedSum = invoices.reduce((acc, i) => acc + (i.total_amount || 0), 0);
  const totalPOSum = purchaseOrders.reduce((acc, p) => acc + (p.total_amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Database className="w-3 h-3" />
              READ-ONLY ERP REPOSITORY
            </span>
            <span className="text-xs font-mono text-zinc-500">•</span>
            <span className="text-xs font-mono text-zinc-400">Deterministic Source of Truth</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Enterprise ERP Explorer
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Audit and inspect raw relational tables: Invoices, Purchase Orders, Goods Receipt Notes, and Vendors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            disabled={isAnyFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-700/60 hover:border-blue-500/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnyFetching ? "animate-spin text-blue-400" : ""}`} />
            <span>Refresh ERP Tables</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards for ERP Entities */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoices */}
        <GlassPanel className="p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Invoices</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{invoices.length}</div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            Gross Total: <span className="text-zinc-200 font-semibold">{formatCurrency(totalInvoicedSum)}</span>
          </div>
        </GlassPanel>

        {/* Total POs */}
        <GlassPanel className="p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Purchase Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{purchaseOrders.length}</div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            Committed: <span className="text-zinc-200 font-semibold">{formatCurrency(totalPOSum)}</span>
          </div>
        </GlassPanel>

        {/* Total GRNs */}
        <GlassPanel className="p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Receipt Notes (GRN)</span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{grns.length}</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Dock Receiving Active
          </div>
        </GlassPanel>

        {/* Total Vendors */}
        <GlassPanel className="p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Active Vendors</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{vendors.length}</div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            Enterprise Suppliers Verified
          </div>
        </GlassPanel>
      </div>

      {/* Main Tabs Container */}
      <GlassPanel className="p-5 sm:p-6 border-zinc-800/80 bg-[#18181B]/80 space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => handleTabChange("invoices")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "invoices"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoices ({invoices.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("pos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "pos"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Purchase Orders ({purchaseOrders.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("grns")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "grns"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Goods Receipts ({grns.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("vendors")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "vendors"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Vendors ({vendors.length})</span>
            </button>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Filtered by: &quot;{searchQuery}&quot;</span>
              <button
                onClick={() => handleTabChange(activeTab, "")}
                className="text-blue-400 hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Invoices */}
        {activeTab === "invoices" && (
          <InvoicesTable
            invoices={invoices}
            isLoading={loadingInvoices}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectPo={navigateToPO}
            onSelectVendor={navigateToVendor}
            onInspectLines={handleInspectInvoice}
          />
        )}

        {/* Tab 2: Purchase Orders */}
        {activeTab === "pos" && (
          <PurchaseOrdersTable
            purchaseOrders={purchaseOrders}
            isLoading={loadingPOs}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectVendor={navigateToVendor}
            onFindInvoices={navigateToInvoicesForPO}
            onFindGRNs={navigateToGRNsForPO}
            onInspectLines={handleInspectPO}
          />
        )}

        {/* Tab 3: Goods Receipt Notes */}
        {activeTab === "grns" && (
          <GRNTable
            grns={grns}
            isLoading={loadingGRNs}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectPo={navigateToPO}
            onSelectVendor={navigateToVendor}
            onInspectLines={handleInspectGRN}
          />
        )}

        {/* Tab 4: Vendors */}
        {activeTab === "vendors" && (
          <VendorsTable
            vendors={vendors}
            isLoading={loadingVendors}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onViewInvoices={navigateToInvoicesForVendor}
            onViewPOs={navigateToPOsForVendor}
          />
        )}
      </GlassPanel>

      {/* Modal for Line Items */}
      <LineItemsModal data={modalData} onClose={() => setModalData(null)} />
    </div>
  );
}

export default function ErpExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-zinc-400 font-mono text-sm">
          Loading ERP Explorer...
        </div>
      }
    >
      <ErpExplorerContent />
    </Suspense>
  );
}
