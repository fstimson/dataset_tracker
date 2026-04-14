import { useState, useEffect } from 'react'
import { datasetService } from '../lib/supabase'
import { Dataset } from '../types'

export const useDatasets = (page = 1, pageSize = 50, search = '', status = 'ALL') => {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true)
      setError(null)
      setDebugInfo(null)
      
      try {
        console.log('🔍 Fetching datasets with params:', { page, pageSize, search, status })
        console.log('🔒 Testing cross reference table access after RLS policy update...')
        
        const { data, count, error } = await datasetService.getDatasets(page, pageSize, search, status)
        
        console.log('📊 Supabase response:', { 
          dataLength: data?.length, 
          count, 
          error: error?.message,
          hasData: !!data && data.length > 0
        })
        
        setDebugInfo({ 
          supabaseData: data, 
          supabaseCount: count, 
          supabaseError: error,
          policyWorking: !!data && data.length > 0
        })
        
        if (error) throw error
        
        if (data && data.length > 0) {
          console.log('✅ SUCCESS! Cross reference policy working - got real data')
        } else {
          console.log('⚠️ No data returned - policy might still be propagating')
        }
        
        setDatasets(data || [])
        setTotalCount(count || 0)
      } catch (err) {
        console.error('❌ Database query failed - RLS policy may not be working:', err)
        setDebugInfo({ error: err })
        setError(err instanceof Error ? err.message : 'Failed to fetch datasets')
        
        console.log('❌ Showing empty data due to RLS error')
        setDatasets([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [page, pageSize, search, status])

  return { datasets, loading, error, totalCount, debugInfo }
}

export const useDataset = (filename: string | null) => {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!filename) {
      setDataset(null)
      return
    }

    const fetchDataset = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await datasetService.getDatasetByFilename(filename)
        
        if (error) throw error
        
        setDataset(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dataset')
      } finally {
        setLoading(false)
      }
    }

    fetchDataset()
  }, [filename])

  return { dataset, loading, error }
}