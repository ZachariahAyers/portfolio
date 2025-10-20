import React, { useEffect, useRef } from 'react';

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const invadersRef = useRef([]);
  const animationRef = useRef(null);
  const lastSpawnRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Invader class
    class Invader {
      constructor() {
        this.size = 30;
        this.speed = 0.5 + Math.random() * 1.5;
        
        // Random spawn from any edge
        const edge = Math.floor(Math.random() * 4);
        switch(edge) {
          case 0: // top
            this.x = Math.random() * canvas.width;
            this.y = -this.size;
            this.dx = (Math.random() - 0.5) * this.speed;
            this.dy = this.speed;
            break;
          case 1: // right
            this.x = canvas.width + this.size;
            this.y = Math.random() * canvas.height;
            this.dx = -this.speed;
            this.dy = (Math.random() - 0.5) * this.speed;
            break;
          case 2: // bottom
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.size;
            this.dx = (Math.random() - 0.5) * this.speed;
            this.dy = -this.speed;
            break;
          case 3: // left
            this.x = -this.size;
            this.y = Math.random() * canvas.height;
            this.dx = this.speed;
            this.dy = (Math.random() - 0.5) * this.speed;
            break;
        }
        
        this.color = `hsl(${120 + Math.random() * 60}, 100%, 50%)`;
        this.alive = true;
        this.deathAnimation = 0;
      }

      update() {
        if (this.alive) {
          this.x += this.dx;
          this.y += this.dy;
        } else {
          this.deathAnimation += 0.1;
        }
      }

      draw(ctx) {
        ctx.save();
        
        if (!this.alive) {
          ctx.globalAlpha = Math.max(0, 1 - this.deathAnimation);
          ctx.translate(this.x, this.y);
          ctx.scale(1 + this.deathAnimation * 0.5, 1 + this.deathAnimation * 0.5);
          ctx.translate(-this.x, -this.y);
        }

        // Draw invader shape (classic space invader)
        ctx.fillStyle = this.color;
        const pixelSize = this.size / 8;
        const shape = [
          [0, 0, 1, 0, 0, 0, 1, 0],
          [0, 0, 0, 1, 0, 1, 0, 0],
          [0, 0, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 0, 1, 0, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 0, 1],
          [1, 0, 1, 0, 0, 1, 0, 1],
          [0, 0, 0, 1, 1, 0, 0, 0]
        ];

        shape.forEach((row, y) => {
          row.forEach((pixel, x) => {
            if (pixel) {
              ctx.fillRect(
                this.x - this.size/2 + x * pixelSize,
                this.y - this.size/2 + y * pixelSize,
                pixelSize,
                pixelSize
              );
            }
          });
        });

        ctx.restore();
      }

      isOffScreen(canvas) {
        return this.x < -this.size * 2 || 
               this.x > canvas.width + this.size * 2 ||
               this.y < -this.size * 2 || 
               this.y > canvas.height + this.size * 2;
      }

      isFullyDead() {
        return !this.alive && this.deathAnimation > 1;
      }
    }

    // Explosion particle class
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y, life: 1 });
        if (this.trail.length > 5) this.trail.shift();
        
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.life -= 0.02;
        
        // Update trail
        this.trail.forEach(point => point.life -= 0.1);
      }

      draw(ctx) {
        ctx.save();
        
        // Draw trail
        this.trail.forEach((point, i) => {
          ctx.globalAlpha = this.life * point.life * 0.3;
          ctx.fillStyle = this.color;
          ctx.fillRect(point.x, point.y, this.size * (i / this.trail.length), this.size * (i / this.trail.length));
        });
        
        // Draw main particle
        ctx.globalAlpha = this.life * 0.8;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.restore();
      }
    }

    // Blast effect class
    class Blast {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 80;
        this.life = 1;
        this.rings = [];
        
        // Create multiple rings for sophisticated effect
        for (let i = 0; i < 3; i++) {
          this.rings.push({
            radius: 0,
            speed: 8 + i * 4,
            thickness: 3 - i,
            delay: i * 0.05
          });
        }
      }

      update() {
        this.life -= 0.04;
        
        this.rings.forEach(ring => {
          if (ring.delay > 0) {
            ring.delay -= 0.05;
          } else {
            ring.radius += ring.speed;
          }
        });
      }

      draw(ctx) {
        ctx.save();
        
        // Draw sophisticated ring system
        this.rings.forEach((ring, index) => {
          if (ring.delay <= 0) {
            const alpha = this.life * (0.6 - index * 0.15) * (1 - ring.radius / 200);
            
            if (alpha > 0) {
              ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
              ctx.lineWidth = ring.thickness;
              ctx.shadowBlur = 10;
              ctx.shadowColor = 'rgba(0, 255, 0, 0.5)';
              
              ctx.beginPath();
              ctx.arc(this.x, this.y, ring.radius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        });
        
        // Central flash
        if (this.life > 0.8) {
          const flashAlpha = (this.life - 0.8) * 5;
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 30);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          gradient.addColorStop(0.5, `rgba(0, 255, 0, ${flashAlpha * 0.6})`);
          gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(this.x - 50, this.y - 50, 100, 100);
        }
        
        ctx.restore();
      }
    }

    const particles = [];
    const blasts = [];
    const stars = [];
    const maxInvaders = 100;
    let mouseX = 0;
    let mouseY = 0;
    let chargeTime = 0;
    let screenShake = 0;

    // Initialize stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        pulseSpeed: Math.random() * 0.0005 + 0.0002, // Much slower pulsing
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      chargeTime = Date.now(); // Reset charge time on mouse move
    };

    // Handle clicks
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Create blast effect
      blasts.push(new Blast(clickX, clickY));
      
      // Add subtle screen shake
      screenShake = 8;
      
      // Destroy invaders in blast radius
      const blastRadius = 50;
      invadersRef.current.forEach(invader => {
        if (invader.alive) {
          const dist = Math.sqrt(
            Math.pow(clickX - invader.x, 2) + 
            Math.pow(clickY - invader.y, 2)
          );
          
          if (dist < blastRadius) {
            invader.alive = false;
            
            // Create explosion particles
            for (let i = 0; i < 15; i++) {
              particles.push(new Particle(invader.x, invader.y, invader.color));
            }
          }
        }
      });
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.style.cursor = 'crosshair';

    // Animation loop
    const animate = () => {
      // Apply screen shake
      ctx.save();
      if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake;
        const shakeY = (Math.random() - 0.5) * screenShake;
        ctx.translate(shakeX, shakeY);
        screenShake *= 0.9; // Decay shake
      }
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw pulsating stars
      stars.forEach(star => {
        const pulse = Math.sin(Date.now() * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
        const brightness = star.brightness * pulse;
        
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Spawn new invaders
      const now = Date.now();
      if (now - lastSpawnRef.current > 1000 && invadersRef.current.length < maxInvaders) {
        invadersRef.current.push(new Invader());
        lastSpawnRef.current = now;
        
        // Increase spawn rate over time
        if (invadersRef.current.length > 20) {
          lastSpawnRef.current = now - 500; // Spawn faster
        }
      }

      // Update and draw invaders
      invadersRef.current = invadersRef.current.filter(invader => {
        invader.update();
        invader.draw(ctx);
        return !invader.isOffScreen(canvas) && !invader.isFullyDead();
      });

      // Update and draw blasts
      for (let i = blasts.length - 1; i >= 0; i--) {
        const blast = blasts[i];
        blast.update();
        blast.draw(ctx);
        
        if (blast.life <= 0) {
          blasts.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw(ctx);
        
        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Draw refined charging effect at mouse position
      if (mouseX && mouseY) {
        const charge = Math.min((Date.now() - chargeTime) / 1000, 1); // 0 to 1 over 1 second
        
        ctx.save();
        
        // Subtle rotating reticle
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4 + charge * 0.3;
        ctx.translate(mouseX, mouseY);
        ctx.rotate((Date.now() / 1000) % (Math.PI * 2));
        
        // Draw rotating reticle
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(20, 0);
          ctx.stroke();
        }
        
        ctx.rotate(-(Date.now() / 1000) % (Math.PI * 2));
        ctx.rotate(-(Date.now() / 1000) % (Math.PI * 2));
        
        // Pulsing center dot
        ctx.fillStyle = '#00ff00';
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 200) * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, 3 + charge * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Subtle charging ring
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        ctx.globalAlpha = charge * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 15 + charge * 10, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
      }

      // Draw invader count
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px monospace';
      ctx.fillText(`Invaders: ${invadersRef.current.filter(i => i.alive).length}`, 10, 30);

      ctx.restore(); // Restore from screen shake

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Redistribute stars on resize
      stars.forEach(star => {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      invadersRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ background: 'transparent' }}
    />
  );
};

export default SpaceInvaders;