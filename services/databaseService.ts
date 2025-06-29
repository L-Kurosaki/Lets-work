import { supabase } from './supabaseClient';
import { Job, Bid, Provider, User, Message } from '@/types';

export class DatabaseService {
  // User Authentication
  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  // Jobs
  async createJob(jobData: Omit<Job, 'id' | 'bids' | 'timePosted' | 'status'>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...jobData,
        status: 'posted',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  }

  async getJobs(userLocation?: { latitude: number; longitude: number }) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        bids (*)
      `)
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  }

  async getJobById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        bids (*)
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  // Bids
  async createBid(bidData: Omit<Bid, 'id' | 'timeSubmitted' | 'status'>) {
    const { data, error } = await supabase
      .from('bids')
      .insert([{
        ...bidData,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  }

  async acceptBid(bidId: string) {
    // Update bid status
    const { error: bidError } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId);

    if (bidError) return { error: bidError };

    // Get the bid to find the job
    const { data: bid } = await supabase
      .from('bids')
      .select('job_id, provider_id')
      .eq('id', bidId)
      .single();

    if (bid) {
      // Update job status
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ 
          status: 'confirmed',
          provider_id: bid.provider_id 
        })
        .eq('id', bid.job_id);

      // Reject other bids for the same job
      await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('job_id', bid.job_id)
        .neq('id', bidId);

      return { error: jobError };
    }

    return { error: null };
  }

  // Providers
  async getProviders() {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('rating', { ascending: false });
    
    return { data, error };
  }

  // Messages
  async sendMessage(messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...messageData,
        timestamp: new Date().toISOString(),
        read: false
      }])
      .select()
      .single();
    
    return { data, error };
  }

  async getMessagesForJob(jobId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('job_id', jobId)
      .order('timestamp', { ascending: true });
    
    return { data, error };
  }

  // Real-time subscriptions
  subscribeToJobUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('jobs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' }, 
        callback
      )
      .subscribe();
  }

  subscribeToBidUpdates(jobId: string, callback: (payload: any) => void) {
    return supabase
      .channel('bids')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bids',
          filter: `job_id=eq.${jobId}`
        }, 
        callback
      )
      .subscribe();
  }

  subscribeToMessages(jobId: string, callback: (payload: any) => void) {
    return supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `job_id=eq.${jobId}`
        }, 
        callback
      )
      .subscribe();
  }
}

export const databaseService = new DatabaseService();